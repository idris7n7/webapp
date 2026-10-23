"""The rules of Yashil shahar (the shared tree map): where a tree may stand and how close two trees may be.

Pure functions, no web code, so the server and the tests share them.

Allowed ground comes from static/green_zones.json (built from OpenStreetMap by tools/build_green_zones.py, ODbL):
  green  parks, gardens, school grounds, grass, meadows, woods ... a tree may stand inside one of these
  block  building footprints: never inside one
  roads  roads for vehicles, kept as lines: never within `w` metres of one
Teachers can add more green polygons from the map (stored in the database, passed in as `extra`).
"""
import json
import math
import os

MIN_DISTANCE_M = 2.0
NEAR_WINDOW_M = 40.0  # how far the "nearest tree" search looks when a position is previewed

COMMON_KINDS = ("oak", "pine", "cherry", "poplar", "apple", "plane")
# rare species a student unlocks by finishing this many Pomodoros (only the picture differs)
RARE_KINDS = (("blossom", 10), ("gold", 25), ("magic", 50))
ALL_KINDS = COMMON_KINDS + tuple(k for k, _ in RARE_KINDS)

ZONES_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "green_zones.json")
CELL = 0.005  # degrees (~550 m) of the lookup grid
_M_PER_DEG_LAT = 111320.0


def unlocked_kinds(finished: int) -> list:
    return list(COMMON_KINDS) + [k for k, need in RARE_KINDS if finished >= need]


def meters_between(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine distance in metres."""
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * 6371008.8 * math.asin(min(1.0, math.sqrt(a)))


def degree_box(lat: float, meters: float) -> tuple:
    """(dlat, dlon) in degrees that cover `meters` around a point at this latitude."""
    return meters / _M_PER_DEG_LAT, meters / (_M_PER_DEG_LAT * max(0.2, math.cos(math.radians(lat))))


def nearest_tree(lat: float, lon: float, rows) -> tuple:
    """(distance in metres, row) of the closest of `rows` (each with lat/lon), or (None, None)."""
    best, hit = None, None
    for r in rows:
        d = meters_between(lat, lon, r["lat"], r["lon"])
        if best is None or d < best:
            best, hit = d, r
    return best, hit


def _inside_ring(lat: float, lon: float, ring) -> bool:
    inside = False
    n = len(ring)
    j = n - 1
    for i in range(n):
        yi, xi = ring[i]
        yj, xj = ring[j]
        if (yi > lat) != (yj > lat) and lon < (xj - xi) * (lat - yi) / (yj - yi) + xi:
            inside = not inside
        j = i
    return inside


def _inside_shape(lat: float, lon: float, rings) -> bool:
    """Even-odd: the first ring is the outline, the others are holes."""
    if not rings or not _inside_ring(lat, lon, rings[0]):
        return False
    return not any(_inside_ring(lat, lon, h) for h in rings[1:])


def _segment_distance_m(lat, lon, a, b) -> float:
    k = math.cos(math.radians(lat))
    ax, ay = (a[1] - lon) * k * _M_PER_DEG_LAT, (a[0] - lat) * _M_PER_DEG_LAT
    bx, by = (b[1] - lon) * k * _M_PER_DEG_LAT, (b[0] - lat) * _M_PER_DEG_LAT
    dx, dy = bx - ax, by - ay
    ln = dx * dx + dy * dy
    t = 0.0 if ln == 0 else max(0.0, min(1.0, -(ax * dx + ay * dy) / ln))
    return math.hypot(ax + t * dx, ay + t * dy)


def _cells(box):
    s, w, n, e = box
    for cy in range(math.floor(s / CELL), math.floor(n / CELL) + 1):
        for cx in range(math.floor(w / CELL), math.floor(e / CELL) + 1):
            yield cy, cx


class Zones:
    """The allowed ground, reloaded when the data file changes."""

    def __init__(self, path: str = ZONES_PATH):
        self.path = path
        self._mtime = None
        self.green, self.block, self.roads = [], [], []
        self._grid = {"green": {}, "block": {}, "roads": {}}

    def _load(self):
        try:
            mtime = os.path.getmtime(self.path)
        except OSError:
            self._mtime, self.green, self.block, self.roads = None, [], [], []
            self._grid = {"green": {}, "block": {}, "roads": {}}
            return
        if mtime == self._mtime:
            return
        with open(self.path, encoding="utf-8") as f:
            data = json.load(f)
        self._mtime = mtime
        self.green, self.block, self.roads = data.get("green", []), data.get("block", []), data.get("roads", [])
        self._grid = {"green": {}, "block": {}, "roads": {}}
        for name, items in (("green", self.green), ("block", self.block), ("roads", self.roads)):
            g = self._grid[name]
            for idx, it in enumerate(items):
                box = it["b"]
                if name == "roads":  # a road reaches a little beyond its box
                    pad = 0.0001
                    box = [box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad]
                for c in _cells(box):
                    g.setdefault(c, []).append(idx)

    def available(self) -> bool:
        self._load()
        return bool(self.green)

    def _candidates(self, name, lat, lon):
        items = getattr(self, name)
        return [items[i] for i in self._grid[name].get((math.floor(lat / CELL), math.floor(lon / CELL)), ())]

    def judge(self, lat: float, lon: float, extra=()) -> str:
        """'ok', or why the spot is refused: 'outside' (not green ground), 'building' or 'road'."""
        self._load()
        green = any(
            it["b"][0] <= lat <= it["b"][2] and it["b"][1] <= lon <= it["b"][3] and _inside_shape(lat, lon, it["r"])
            for it in self._candidates("green", lat, lon)
        ) or any(_inside_shape(lat, lon, [ring]) for ring in extra)
        if not green:
            return "outside"
        for it in self._candidates("block", lat, lon):
            if it["b"][0] <= lat <= it["b"][2] and it["b"][1] <= lon <= it["b"][3] and _inside_shape(lat, lon, it["r"]):
                return "building"
        for it in self._candidates("roads", lat, lon):
            pts, w = it["p"], it.get("w", 3.0)
            if any(_segment_distance_m(lat, lon, pts[i], pts[i + 1]) <= w for i in range(len(pts) - 1)):
                return "road"
        return "ok"


REASONS = {
    "outside": "Bu yer yashil hudud emas. Park, bog', maktab hovlisi yoki maysazor tanlang.",
    "building": "Bu yerda bino bor. Binodan tashqarida joy tanlang.",
    "road": "Bu yer yo'lga juda yaqin. Yo'ldan uzoqroq joy tanlang.",
}


def too_close_message(distance_m: float) -> str:
    d = f"{distance_m:.1f}".replace(".", ",")
    return (f"Bu joy oldingi daraxtdan atigi {d} metr uzoqlikda. "
            f"Daraxtlar orasida kamida {MIN_DISTANCE_M:g} metr bo'lishi kerak. Biroz uzoqroq joyni tanlang.")
