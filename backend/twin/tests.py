from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from twin.models import Zone, RoadSegment, SimulationLog
from twin.services import MicroclimateEngine, DecisionSupportEngine


class CampusTwinFullScaleTests(TestCase):
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
            lat=20.2485,
            lng=85.8015
        )
        self.road = RoadSegment.objects.create(
            road_id="R-01",
            name="Main Avenue",
            traffic=75,
            speed=25,
            noise=65,
            risk="HIGH"
        )

    def test_campus_catalog(self):
        res = self.client.get('/api/campuses/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 3)

    def test_multi_campus_filtering(self):
        res = self.client.get('/api/zones/?campus=soa_campus_2')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data[0]['code'], "C2-01")

    def test_get_zones_default(self):
        res = self.client.get('/api/zones/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

    def test_get_alerts(self):
        res = self.client.get('/api/alerts/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreater(res.data["active_alerts_count"], 0)

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

    def test_bulk_sensor_ingest(self):
        payload = {"sensors": [{"code": "Z-01", "temp": 32.0, "pm25": 40}]}
        res = self.client.post('/api/sensors/batch/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.zone.refresh_from_db()
        self.assertEqual(self.zone.temp, 32.0)