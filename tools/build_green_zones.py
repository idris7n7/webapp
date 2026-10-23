"""Builds static/green_zones.json: where a tree of Yashil shahar may stand. Data: OpenStreetMap (ODbL, (c) OpenStreetMap contributors).

  green  parks, gardens, school and college grounds, grass, meadows, woods (cemeteries and fields are left out)
  block  the buildings that stand on that ground (no tree inside a building)
  roads  roads for vehicles next to that ground, as lines with a width (no tree on the road)

The server (green_city.py) and the map (static/green_map.js) both read the file. Run:  python tools/build_green_zones.py
(needs internet; takes a few minutes). Missing places can also be added by an administrator on the map.
"""
import json
import math
import os
import sys
import time
import urllib.parse
import urllib.request

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Overpass asks clients to identify themselves: set CONTACT_EMAIL to your own address before running.
UA = {"User-Agent": "LevelUpApp-setup/1.0 (%s)" % os.environ.get("CONTACT_EMAIL", "set CONTACT_EMAIL")}
ENDPOINTS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter",
             "https://overpass.private.coffee/api/interpreter"]
BBOX = "40.5567,72.0917,40.7583,72.3620"  # Asaka district: south, west, north, east
GREEN_QUERY = """(
  way["leisure"~"^(park|garden|playground|recreation_ground)$"](%(b)s);
  way["landuse"~"^(grass|meadow|village_green|recreation_ground|forest|orchard)$"](%(b)s);
  way["natural"~"^(wood|grassland)$"](%(b)s);
  way["amenity"~"^(school|kindergarten|college|university)$"](%(b)s);
);out geom tags;"""
ROAD_WIDTH = {"motorway": 7, "trunk": 7, "primary": 6, "secondary": 5, "tertiary": 4.5, "unclassified": 3.5,
              "residential": 3.5, "living_street": 3, "service": 3}
GREEN_TOL, BUILDING_TOL, ROAD_TOL = 0.000004, 0.000003, 0.000004  # simplification in degrees (~0.4 m)
PAD = 0.0002  # roads and buildings are fetched this far (~20 m) around every green polygon


def overpass(body, timeout=150):
    data = urllib.parse.urlencode({"data": "[out:json][timeout:%d];%s" % (timeout, body)}).encode()
    for attempt in range(4):  # the public servers are often busy: go round them again after a pause
        for ep in ENDPOINTS:
            try:
                with urllib.request.urlopen(urllib.request.Request(ep, data, headers=UA), timeout=timeout + 30) as r:
                    return json.loads(r.read().decode("utf-8"))["elements"]
            except Exception as e:  # try the next mirror
                print("  %s failed: %s" % (ep, str(e)[:70]))
                sys.stdout.flush()
        time.sleep(30 * (attempt + 1))
    raise SystemExit("every Overpass server failed, try again later")


def simplify(points, tol):
    """Ramer-Douglas-Peucker on [lat, lon] pairs (planar, fine at this scale)."""
    if len(points) < 3:
        return points
    (y1, x1), (y2, x2) = points[0], points[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = math.hypot(dx, dy) or 1e-12
    idx, dmax = 0, 0.0
    for i in range(1, len(points) - 1):
        d = abs(dy * points[i][1] - dx * points[i][0] + x2 * y1 - y2 * x1) / norm
        if d > dmax:
            idx, dmax = i, d
    if dmax <= tol:
        return [points[0], points[-1]]
    return simplify(points[: idx + 1], tol)[:-1] + simplify(points[idx:], tol)


def ring_of(geometry, tol):
    pts = [[p["lat"], p["lon"]] for p in geometry]
    if len(pts) < 4 or pts[0] != pts[-1]:
        return None
    pts = pts[:-1]  # open ring
    half = len(pts) // 2
    pts = simplify(pts[: half + 1], tol)[:-1] + simplify(pts[half:] + [pts[0]], tol)[:-1]
    if len(pts) < 3:
        return None
    return [[round(a, 6), round(b, 6)] for a, b in pts]


def box_of(points):
    lats, lons = [p[0] for p in points], [p[1] for p in points]
    return [round(min(lats), 6), round(min(lons), 6), round(max(lats), 6), round(max(lons), 6)]


def boxes_touch(a, b):
    return not (a[2] < b[0] or b[2] < a[0] or a[3] < b[1] or b[3] < a[1])


def inside(lat, lon, ring):
    ok, j = False, len(ring) - 1
    for i in range(len(ring)):
        yi, xi = ring[i]
        yj, xj = ring[j]
        if (yi > lat) != (yj > lat) and lon < (xj - xi) * (lat - yi) / (yj - yi) + xi:
            ok = not ok
        j = i
    return ok


def main():
    print("green ground ...")
    green = []
    for e in overpass(GREEN_QUERY % {"b": BBOX}):
        t = e.get("tags", {})
        if "building" in t or e.get("type") != "way":
            continue
        ring = ring_of(e.get("geometry", []), GREEN_TOL)
        if ring:
            green.append({"b": box_of(ring), "r": [ring], "n": t.get("name", "")})
    print("  polygons:", len(green))

    # buildings and roads around the green ground, fetched in groups of bounding boxes
    print("buildings and roads ...")
    block, roads, seen_b, seen_r = [], [], set(), set()
    group = 40
    for i in range(0, len(green), group):
        boxes = [g["b"] for g in green[i:i + group]]
        parts = []
        for s, w, n, e2 in boxes:
            bb = "%.6f,%.6f,%.6f,%.6f" % (s - PAD, w - PAD, n + PAD, e2 + PAD)
            parts.append('way["building"](%s);' % bb)
            parts.append('way["highway"~"^(%s)$"](%s);' % ("|".join(ROAD_WIDTH), bb))
        for e in overpass("(%s);out geom tags;" % "".join(parts)):
            t, geo = e.get("tags", {}), e.get("geometry", [])
            if "building" in t and e["id"] not in seen_b:
                seen_b.add(e["id"])
                ring = ring_of(geo, BUILDING_TOL)
                if ring:
                    block.append({"b": box_of(ring), "r": [ring]})
            elif t.get("highway") in ROAD_WIDTH and e["id"] not in seen_r and len(geo) > 1:
                seen_r.add(e["id"])
                pts = simplify([[p["lat"], p["lon"]] for p in geo], ROAD_TOL)
                roads.append({"b": box_of(pts), "p": [[round(a, 6), round(b, 6)] for a, b in pts], "w": ROAD_WIDTH[t["highway"]]})
        print("  group %d/%d: %d buildings, %d roads so far" % (i // group + 1, math.ceil(len(green) / group), len(block), len(roads)))
        sys.stdout.flush()

    # keep only what touches green ground
    block = [b for b in block if any(boxes_touch(b["b"], g["b"]) and any(inside(p[0], p[1], g["r"][0]) for p in b["r"][0]) for g in green)]
    roads = [r for r in roads if any(boxes_touch([r["b"][0] - PAD, r["b"][1] - PAD, r["b"][2] + PAD, r["b"][3] + PAD], g["b"]) for g in green)]
    for g in green:
        g.pop("n", None)
    out = {"v": 1, "source": "OpenStreetMap contributors, ODbL", "green": green, "block": block, "roads": roads}
    path = os.path.join(APP, "static", "green_zones.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, separators=(",", ":"))
    ha = 0.0
    for g in green:  # rough area, for the report only
        r = g["r"][0]
        k = math.cos(math.radians(r[0][0]))
        ha += abs(sum(r[i][1] * k * r[(i + 1) % len(r)][0] - r[(i + 1) % len(r)][1] * k * r[i][0] for i in range(len(r)))) / 2 * 111320 ** 2 / 10000
    print("green: %d polygons (~%d ha), buildings: %d, roads: %d, file: %d KB" % (len(green), ha, len(block), len(roads), os.path.getsize(path) // 1024))


if __name__ == "__main__":
    main()
