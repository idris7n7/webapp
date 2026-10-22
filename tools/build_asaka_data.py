"""Builds the data behind the Asaka forest from OpenStreetMap (ODbL, (c) OpenStreetMap contributors).

  asaka_spots.json         real places a tree can be planted at (server side)
  static/asaka_boundary.json  simplified district outline (map bounds + green tint)

Only places that have a Latin (Uzbek) name in OSM are used, so every location announced to a student is a real
place and none is invented here. Run:  python build_asaka_data.py   (needs internet)
"""
import json
import math
import os
import re
import urllib.parse
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(BASE)
# Overpass asks clients to identify themselves: set CONTACT_EMAIL to your own address before running.
UA = {"User-Agent": "LevelUpApp-setup/1.0 (%s)" % os.environ.get("CONTACT_EMAIL", "set CONTACT_EMAIL")}
RELATION = 15534829  # Asaka tumani, Andijon viloyati


def fetch(url, data=None):
    req = urllib.request.Request(url, data=data, headers=UA)
    with urllib.request.urlopen(req, timeout=150) as r:
        return json.loads(r.read().decode("utf-8"))


def simplify(points, tol):
    """Ramer-Douglas-Peucker on [lon, lat] pairs (planar, fine at this scale)."""
    if len(points) < 3:
        return points
    (x1, y1), (x2, y2) = points[0], points[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = math.hypot(dx, dy) or 1e-12
    idx, dmax = 0, 0.0
    for i in range(1, len(points) - 1):
        d = abs(dy * points[i][0] - dx * points[i][1] + x2 * y1 - y2 * x1) / norm
        if d > dmax:
            idx, dmax = i, d
    if dmax <= tol:
        return [points[0], points[-1]]
    return simplify(points[: idx + 1], tol)[:-1] + simplify(points[idx:], tol)


def boundary():
    q = urllib.parse.urlencode({"q": "Asaka District, Andijan Region, Uzbekistan", "format": "jsonv2",
                                "polygon_geojson": 1, "limit": 5, "polygon_threshold": 0.0004})
    hit = next(r for r in fetch("https://nominatim.openstreetmap.org/search?" + q) if r["osm_id"] == RELATION)
    geo = hit["geojson"]
    ring = geo["coordinates"][0] if geo["type"] == "Polygon" else max((p[0] for p in geo["coordinates"]), key=len)
    ring = [tuple(p) for p in ring]
    mid = len(ring) // 2  # the ring is closed (first == last), so simplify it in two halves
    ring = simplify(ring[: mid + 1], 0.0006)[:-1] + simplify(ring[mid:], 0.0006)
    lat0, lat1, lon0, lon1 = (float(v) for v in hit["boundingbox"])
    out = {"bbox": [lat0, lon0, lat1, lon1],
           "polygon": [[round(x, 5), round(y, 5)] for x, y in ring]}  # [lon, lat]
    with open(os.path.join(APP, "static", "asaka_boundary.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print("boundary points:", len(out["polygon"]), "bbox:", out["bbox"])


QUERY = """
[out:json][timeout:90];
area(%d)->.a;
(
  nwr(area.a)["place"~"^(city|village|hamlet|suburb|neighbourhood)$"]["name"];
  nwr(area.a)["amenity"~"^(school|college)$"]["name"];
);
out center tags;
""" % (3600000000 + RELATION)
LATIN = re.compile(r"^[A-Za-z0-9ʻ'‘’`\-\. №]+$")


def slug(prefix, name):
    return prefix + "-" + re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def spots():
    els = fetch("https://overpass-api.de/api/interpreter", urllib.parse.urlencode({"data": QUERY}).encode())["elements"]
    out = {}
    for e in els:
        t = e["tags"]
        name = (t.get("name:uz") or t.get("name") or "").strip()
        if not name or not LATIN.match(name):
            continue
        c = e if "lat" in e else e["center"]
        lat, lon = round(c["lat"], 6), round(c["lon"], 6)
        place, amenity = t.get("place"), t.get("amenity")
        if place == "city":
            s = dict(id="city-asaka", name=f"{name} shahri", kind="city", radius=900, weight=14)
        elif place in ("village", "hamlet"):
            s = dict(id=slug("v", name), name=f"{name} qishlog'i", kind="village", radius=450, weight=8)
        elif place in ("suburb", "neighbourhood"):
            s = dict(id=slug("m", name), name=f"{name} mahallasi", kind="mahalla", radius=300, weight=6)
        elif amenity == "school" and name.startswith("Asaka tuman"):
            s = dict(id=slug("s", name), name=f"{name} hovlisi", kind="school", radius=70, weight=3)
        elif amenity == "college" and name.startswith("Asaka"):
            s = dict(id=slug("c", name), name=f"{name} hovlisi", kind="college", radius=70, weight=3)
        else:
            continue
        s.update(lat=lat, lon=lon)
        out.setdefault(s["id"], s)  # one entry per id (OSM sometimes maps one place twice)
    lst = sorted(out.values(), key=lambda s: (s["kind"], s["name"]))
    with open(os.path.join(APP, "asaka_spots.json"), "w", encoding="utf-8") as f:
        json.dump(lst, f, ensure_ascii=False, indent=1)
    kinds = {}
    for s in lst:
        kinds[s["kind"]] = kinds.get(s["kind"], 0) + 1
    print("spots:", len(lst), kinds)


if __name__ == "__main__":
    boundary()
    spots()
