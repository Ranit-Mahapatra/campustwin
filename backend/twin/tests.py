from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from twin.models import Zone, RoadSegment, SimulationLog
from twin.services import MicroclimateEngine, DecisionSupportEngine

class MicroclimateEngineTests(TestCase):
    def test_tree_canopy_simulation(self):
        result = MicroclimateEngine.run_simulation(
            base_temp=36.0, base_pm25=90, intervention="trees", intensity=50
        )
        self.assertEqual(result["temp_drop"], 2.0)
        self.assertEqual(result["simulated_temp"], 34.0)
        self.assertLess(result["simulated_pm25"], 90)

    def test_decision_support_recommendations(self):
        zone = Zone.objects.create(
            code="Z-TEST",
            name="Test Quad",
            temp=39.0,
            pm25=110,
            aqi="Poor",
            vulnerability=9,
            tree_cover=10,
            lat=20.2961,
            lng=85.8245
        )
        recs = DecisionSupportEngine.generate_recommendations(zone)
        self.assertTrue(len(recs) >= 2)
        priorities = [r["priority"] for r in recs]
        self.assertIn("HIGH", priorities)


class CampusTwinAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.zone = Zone.objects.create(
            code="Z-01",
            name="Hostel 1",
            temp=38.5,
            pm25=105,
            aqi="Poor",
            vulnerability=8,
            tree_cover=12,
            lat=20.2961,
            lng=85.8245
        )
        self.road = RoadSegment.objects.create(
            name="Main Avenue",
            traffic=75,
            speed=25,
            noise=65.0,
            risk="HIGH"
        )

    def test_get_zones(self):
        res = self.client.get('/api/zones/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

    def test_get_alerts(self):
        res = self.client.get('/api/alerts/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreater(res.data["active_alerts_count"], 0)

    def test_copilot_automated_insights(self):
        res = self.client.get('/api/copilot/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("actionable_insights", res.data)

    def test_simulate_endpoint(self):
        payload = {"zone_code": "Z-01", "intervention": "cool_roof", "intensity": 60}
        res = self.client.post('/api/simulate/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(SimulationLog.objects.count(), 1)

    def test_csv_export_endpoint(self):
        SimulationLog.objects.create(
            zone=self.zone,
            intervention="misting",
            intensity=50,
            simulated_temp=35.0,
            simulated_pm25=70
        )
        res = self.client.get('/api/simulations/export/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res['Content-Type'], 'text/csv')