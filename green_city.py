"""The rules of Yashil shahar (the shared tree map): where a tree may stand and how close two trees may be.

Pure functions, no web code, so the server and the tests share them.

Allowed ground comes from static/green_zones.json (built from OpenStreetMap by tools/build_green_zones.py, ODbL):
  green  parks, gardens, school grounds, grass, meadows, woods ... a tree may stand inside one of these
  block  building footprints: never inside one
  roads  roads for vehicles, kept as lines: never within `w` metres of one
Teachers can add more green polygons from the map (stored in the database, passed in as `extra`).

Places: every green area is a place the class fills with trees, nearest to the middle of Asaka first. A place takes one
tree per M2_PER_TREE of its ground (PLACE_MIN_TREES .. PLACE_MAX_TREES). Only the first place that is not full is open;
the others are locked until it is. When every place of Asaka is full, Andijan has one city fewer left to green.
"""
import json
import math
import os

MIN_DISTANCE_M = 2.0
NEAR_WINDOW_M = 40.0  # how far the "nearest tree" search looks when a position is previewed

COMMON_KINDS = ("oak", "pine", "cherry", "poplar", "apple", "plane")
FREE_KIND = "oak"  # every student may plant this one for nothing; the others are bought once with points
# price in points (what the student earned in games, homework and lessons)
PRICES = {"pine": 30, "poplar": 40, "cherry": 60, "apple": 80, "plane": 100, "blossom": 200, "gold": 400, "magic": 800}
RARE_KINDS = (("blossom", 200), ("gold", 400), ("magic", 800))
ALL_KINDS = (FREE_KIND,) + tuple(PRICES)

ZONES_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "green_zones.json")
CELL = 0.005  # degrees (~550 m) of the lookup grid
_M_PER_DEG_LAT = 111320.0

CITY_CENTRE = (40.6417, 72.2383)  # the middle of Asaka town: the places are filled from here outwards
M2_PER_TREE = 400  # about one tree every 20 m
PLACE_MIN_TREES, PLACE_MAX_TREES = 5, 30
REGION = "Andijon"
HOME_CITY = "Asaka"
# The 14 districts and the 2 cities of Andijan region: the cities the classes green one after another.
REGION_CITIES = ("Andijon shahri", "Xonobod shahri", "Andijon", "Asaka", "Baliqchi", "Bo'ston", "Buloqboshi", "Izboskan",
                 "Jalaquduq", "Xo'jaobod", "Qo'rg'ontepa", "Marhamat", "Oltinko'l", "Paxtaobod", "Shahrixon", "Ulug'nor")


def owned_kinds(bought) -> list:
    """The free tree plus every kind the student has bought, in shop order."""
    bought = set(bought)
    return [FREE_KIND] + [k for k in PRICES if k in bought]


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


def _ring_area_m2(ring) -> float:
    if len(ring) < 3:
        return 0.0
    k = math.cos(math.radians(sum(p[0] for p in ring) / len(ring))) * _M_PER_DEG_LAT
    s = 0.0
    for i in range(len(ring)):
        (y1, x1), (y2, x2) = ring[i], ring[(i + 1) % len(ring)]
        s += x1 * k * y2 * _M_PER_DEG_LAT - x2 * k * y1 * _M_PER_DEG_LAT
    return abs(s) / 2


def place_capacity(rings) -> int:
    """How many trees fill a place: one per M2_PER_TREE of its ground (holes left out), within the limits."""
    area = _ring_area_m2(rings[0]) - sum(_ring_area_m2(h) for h in rings[1:]) if rings else 0.0
    return max(PLACE_MIN_TREES, min(PLACE_MAX_TREES, round(area / M2_PER_TREE)))


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
        self._places = []

    def _load(self):
        try:
            mtime = os.path.getmtime(self.path)
        except OSError:
            self._mtime, self.green, self.block, self.roads = None, [], [], []
            self._grid = {"green": {}, "block": {}, "roads": {}}
            self._places = []
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
        centre = lambda it: ((it["b"][0] + it["b"][2]) / 2, (it["b"][1] + it["b"][3]) / 2)  # noqa: E731
        order = sorted(range(len(self.green)), key=lambda i: (meters_between(*centre(self.green[i]), *CITY_CENTRE), i))
        self._places = [(i, place_capacity(self.green[i]["r"])) for i in order]

    def available(self) -> bool:
        self._load()
        return bool(self.green)

    def places(self) -> list:
        """Every green area as a place to fill, nearest to the middle of the town first: [(green index, trees it takes)]."""
        self._load()
        return self._places

    def _candidates(self, name, lat, lon):
        return self._grid[name].get((math.floor(lat / CELL), math.floor(lon / CELL)), ())

    def _in_green(self, idx: int, lat: float, lon: float) -> bool:
        it = self.green[idx]
        return it["b"][0] <= lat <= it["b"][2] and it["b"][1] <= lon <= it["b"][3] and _inside_shape(lat, lon, it["r"])

    def place_of(self, lat: float, lon: float):
        """The green index of the place this point lies in, or None."""
        self._load()
        return next((i for i in self._candidates("green", lat, lon) if self._in_green(i, lat, lon)), None)

    def judge(self, lat: float, lon: float, extra=(), open_place=None) -> str:
        """'ok', or why the spot is refused: 'road', 'building', 'locked' (a place that is not open yet) or 'outside'.

        With `open_place` (a green index) only that place and the areas a teacher drew take trees; without it every
        green area does."""
        self._load()
        for i in self._candidates("roads", lat, lon):
            pts, w = self.roads[i]["p"], self.roads[i].get("w", 3.0)
            if any(_segment_distance_m(lat, lon, pts[k], pts[k + 1]) <= w for k in range(len(pts) - 1)):
                return "road"
        for i in self._candidates("block", lat, lon):
            it = self.block[i]
            if it["b"][0] <= lat <= it["b"][2] and it["b"][1] <= lon <= it["b"][3] and _inside_shape(lat, lon, it["r"]):
                return "building"
        if any(_inside_shape(lat, lon, [ring]) for ring in extra):
            return "ok"
        if open_place is not None and open_place < len(self.green) and self._in_green(open_place, lat, lon):
            return "ok"
        inside = [i for i in self._candidates("green", lat, lon) if self._in_green(i, lat, lon)]
        if not inside:
            return "outside"
        return "ok" if open_place is None else "locked"

    def progress(self, trees) -> dict:
        """How far the places are filled by `trees` (lat, lon pairs): the open place (None when all are full), the trees
        in every place that has some, and how many places are full."""
        self._load()
        counts = {}
        for lat, lon in trees:
            p = self.place_of(lat, lon)
            if p is not None:
                counts[p] = counts.get(p, 0) + 1
        full = sum(1 for i, cap in self._places if counts.get(i, 0) >= cap)
        open_place = next((i for i, cap in self._places if counts.get(i, 0) < cap), None)
        return {"open": open_place, "counts": counts, "full": full, "total": len(self._places)}


REASONS = {
    "outside": "Bu yer daraxt ekishga mos emas. Xaritada yashil chiziq bilan belgilangan ochiq joyni tanlang.",
    "building": "Bu yerda bino bor. Binodan tashqarida joy tanlang.",
    "road": "Yo'lning o'rtasiga daraxt ekilganini qayerda ko'rgansiz? Yo'ldan chetroq joy tanlang.",
    "locked": "Bu joy hali yopiq. Avval ochiq joyni (yashil chiziq bilan belgilangan) daraxtlarga to'ldiramiz.",
}


def region_view(progress: dict) -> dict:
    """Andijan's cities left to green: Asaka counts as done once every one of its places is full."""
    home_done = progress["total"] > 0 and progress["open"] is None
    return {"name": REGION, "cities": len(REGION_CITIES), "left": len(REGION_CITIES) - (1 if home_done else 0),
            "home": HOME_CITY, "homeDone": home_done}


def too_close_message(distance_m: float) -> str:
    d = f"{distance_m:.1f}".replace(".", ",")
    return (f"Bu joy oldingi daraxtdan atigi {d} metr uzoqlikda. "
            f"Daraxtlar orasida kamida {MIN_DISTANCE_M:g} metr bo'lishi kerak. Biroz uzoqroq joyni tanlang.")
