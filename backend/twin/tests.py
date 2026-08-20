from django.test import TestCase
from rest_framework.test import APIClient

from .models import Zone, RoadSegment


class ApiContractTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.zone = Zone.objects.create(
            code="Z-99",
            name="Test Zone",
            lat=20.25,
            lng=85.80,
            temp=35.0,
            pm25=60,
            aqi="Moderate",
            confidence="sensor",
            vulnerability=8,
            tree_cover=12,
            reason="test fixture",
        )
        RoadSegment.objects.create(
            road_id="R-99",
            name="Test Road",
            from_point="A",
            to_point="B",
            traffic=70,
            speed=25,
            noise=65,
            risk="HIGH",
            coordinates=[[85.80, 20.25], [85.81, 20.26]],
        )

    def test_zones_list(self):
        response = self.client.get("/api/zones/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(item["code"] == "Z-99" for item in response.json()))
        sample = next(item for item in response.json() if item["code"] == "Z-99")
        self.assertIn("treeCover", sample)
        self.assertNotIn("tree_cover", sample)

    def test_roads_list(self):
        response = self.client.get("/api/roads/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(item["id"] == "R-99" for item in response.json()))

    def test_metrics(self):
        response = self.client.get("/api/metrics/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        for key in ("avg_temp", "max_pm25", "avg_green_cover", "risk_zones_count", "traffic_status"):
            self.assertIn(key, payload)

    def test_trends_default_range(self):
        response = self.client.get("/api/trends/?range=24h")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        for key in ("labels", "aqi", "temp", "traffic", "pm25"):
            self.assertIn(key, payload)

    def test_simulate_valid(self):
        response = self.client.post(
            "/api/simulate/",
            {"zone_code": "Z-99", "intervention": "trees", "intensity": 50},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["zone_code"], "Z-99")
        self.assertIn("simulated_temp", payload)
        self.assertIn("simulated_pm25", payload)

    def test_simulate_invalid_intensity(self):
        response = self.client.post(
            "/api/simulate/",
            {"zone_code": "Z-99", "intervention": "trees", "intensity": 5},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_simulate_missing_zone(self):
        response = self.client.post(
            "/api/simulate/",
            {"zone_code": "Z-MISSING", "intervention": "shade", "intensity": 40},
            format="json",
        )
        self.assertEqual(response.status_code, 404)

    def test_copilot(self):
        response = self.client.post(
            "/api/copilot/",
            {"question": "Which area needs trees?"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("answer", response.json())
        self.assertIn("Test Zone", response.json()["answer"])
