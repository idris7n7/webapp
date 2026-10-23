"""Unit tests for the planting rules of Yashil shahar (green_city.py)."""
import json
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import green_city  # noqa: E402

M = 1 / 111320  # one metre in degrees of latitude


def square(s, w, n, e):
    return [[s, w], [s, e], [n, e], [n, w]]


class GeometryTests(unittest.TestCase):
    def test_distance_in_metres(self):
        self.assertAlmostEqual(green_city.meters_between(40.6, 72.2, 40.6 + 2 * M, 72.2), 2.0, delta=0.01)
        self.assertAlmostEqual(green_city.meters_between(40.6, 72.2, 40.6, 72.2), 0.0)
        east = green_city.meters_between(40.6, 72.2, 40.6, 72.2 + 0.001)
        self.assertAlmostEqual(east, 111320 * 0.001 * 0.7593, delta=0.5)  # a degree of longitude is shorter at 40.6 N

    def test_nearest_tree_picks_the_closest(self):
        rows = [{"lat": 40.6 + 10 * M, "lon": 72.2, "id": 1}, {"lat": 40.6 + 3 * M, "lon": 72.2, "id": 2}]
        d, hit = green_city.nearest_tree(40.6, 72.2, rows)
        self.assertEqual((hit["id"], round(d, 1)), (2, 3.0))
        self.assertEqual(green_city.nearest_tree(40.6, 72.2, []), (None, None))

    def test_the_message_names_the_distance_with_a_comma(self):
        msg = green_city.too_close_message(1.4)
        self.assertIn("atigi 1,4 metr", msg)
        self.assertIn("kamida 2 metr", msg)

    def test_rare_kinds_unlock_with_finished_blocks(self):
        self.assertEqual(green_city.unlocked_kinds(0), list(green_city.COMMON_KINDS))
        self.assertIn("blossom", green_city.unlocked_kinds(10))
        self.assertNotIn("gold", green_city.unlocked_kinds(24))
        self.assertIn("magic", green_city.unlocked_kinds(50))

    def test_degree_box_covers_the_distance(self):
        dlat, dlon = green_city.degree_box(40.6, 40)
        self.assertGreaterEqual(green_city.meters_between(40.6, 72.2, 40.6 + dlat, 72.2), 39.9)
        self.assertGreaterEqual(green_city.meters_between(40.6, 72.2, 40.6, 72.2 + dlon), 39.9)


class ZonesTests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory(ignore_cleanup_errors=True)
        outer = square(40.600, 72.200, 40.602, 72.204)
        hole = square(40.6008, 72.2018, 40.6012, 72.2022)  # a pond in the park
        data = {
            "green": [{"b": [40.600, 72.200, 40.602, 72.204], "r": [outer, hole]}],
            "block": [{"b": [40.6004, 72.2004, 40.6005, 72.2006], "r": [square(40.6004, 72.2004, 40.6005, 72.2006)]}],
            "roads": [{"b": [40.6015, 72.2, 40.6015, 72.204], "p": [[40.6015, 72.2], [40.6015, 72.204]], "w": 4}],
        }
        self.path = os.path.join(self._tmp.name, "z.json")
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(data, f)
        self.zones = green_city.Zones(self.path)

    def tearDown(self):
        self._tmp.cleanup()

    def test_each_kind_of_refusal(self):
        z = self.zones
        self.assertEqual(z.judge(40.6003, 72.2030), "ok")
        self.assertEqual(z.judge(40.5990, 72.2030), "outside")
        self.assertEqual(z.judge(40.60045, 72.2005), "building")
        self.assertEqual(z.judge(40.6010, 72.2020), "outside")  # the hole of the polygon
        self.assertEqual(z.judge(40.6015 + 3 * M, 72.2010), "road")
        self.assertEqual(z.judge(40.6015 + 6 * M, 72.2010), "ok")  # beyond the road's width

    def test_extra_areas_drawn_by_an_administrator_count_as_green(self):
        extra = [square(40.6100, 72.2100, 40.6110, 72.2110)]
        self.assertEqual(self.zones.judge(40.6105, 72.2105), "outside")
        self.assertEqual(self.zones.judge(40.6105, 72.2105, extra), "ok")

    def test_a_missing_file_means_nothing_is_green(self):
        z = green_city.Zones(os.path.join(self._tmp.name, "nope.json"))
        self.assertFalse(z.available())
        self.assertEqual(z.judge(40.6, 72.2), "outside")

    def test_the_file_is_read_again_when_it_changes(self):
        self.assertTrue(self.zones.available())
        self.assertEqual(self.zones.judge(40.6105, 72.2105), "outside")
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump({"green": [{"b": [40.61, 72.21, 40.611, 72.211], "r": [square(40.61, 72.21, 40.611, 72.211)]}]}, f)
        os.utime(self.path, (os.path.getmtime(self.path) + 5, os.path.getmtime(self.path) + 5))
        self.assertEqual(self.zones.judge(40.6105, 72.2105), "ok")


if __name__ == "__main__":
    unittest.main()
