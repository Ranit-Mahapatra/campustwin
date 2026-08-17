from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg, Max
from .models import Zone, RoadSegment, SimulationLog
from .serializers import (
    ZoneSerializer,
    RoadSegmentSerializer,
    SimulationInputSerializer,
    CopilotQuerySerializer
)

class ZoneListAPIView(APIView):
    def get(self, request):
        zones = Zone.objects.all()
        serializer = ZoneSerializer(zones, many=True)
        return Response(serializer.data)

class RoadListAPIView(APIView):
    def get(self, request):
        roads = RoadSegment.objects.all()
        serializer = RoadSegmentSerializer(roads, many=True)
        return Response(serializer.data)

class CampusMetricsAPIView(APIView):
    def get(self, request):
        zones = Zone.objects.all()
        if not zones.exists():
            return Response({"error": "No zones found"}, status=status.HTTP_404_NOT_FOUND)

        avg_temp = zones.aggregate(Avg('temp'))['temp__avg'] or 0
        max_pm = zones.aggregate(Max('pm25'))['pm25__max'] or 0
        avg_green = zones.aggregate(Avg('tree_cover'))['tree_cover__avg'] or 0
        risk_count = zones.filter(vulnerability__gte=8).count()

        return Response({
            "avg_temp": round(avg_temp, 1),
            "max_pm25": max_pm,
            "avg_green_cover": round(avg_green),
            "risk_zones_count": risk_count,
            "traffic_status": "HIGH"
        })

class TrendDataAPIView(APIView):
    def get(self, request):
        time_range = request.query_params.get('range', '24h')
        modeled_trends = {
            "24h": {
                "labels": ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 AM"],
                "aqi": [72, 86, 104, 121, 138, 126, 112, 96, 84, 76],
                "temp": [24, 26, 29, 32, 35, 34, 31, 28, 26, 25],
                "traffic": [18, 42, 61, 78, 88, 72, 58, 36, 24, 16],
                "pm25": [34, 41, 48, 59, 67, 61, 54, 46, 39, 35]
            },
            "7d": {
                "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                "aqi": [94, 101, 108, 116, 103, 88, 82],
                "temp": [31, 32, 33, 35, 34, 30, 29],
                "traffic": [62, 68, 73, 81, 76, 45, 34],
                "pm25": [46, 51, 55, 61, 53, 42, 39]
            }
        }
        return Response(modeled_trends.get(time_range, modeled_trends["24h"]))

class SimulationAPIView(APIView):
    FACTORS = {
        'trees': (4.0, 18.0),
        'shade': (3.0, 10.0),
        'traffic': (2.0, 22.0),
        'roof': (3.0, 5.0),
    }

    def post(self, request):
        serializer = SimulationInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        zone = Zone.objects.filter(code=serializer.validated_data['zone_code']).first()
        if not zone:
            return Response({"error": "Zone not found"}, status=status.HTTP_404_NOT_FOUND)

        intervention = serializer.validated_data['intervention']
        intensity = serializer.validated_data['intensity']
        factor_temp, factor_pm = self.FACTORS[intervention]
        fraction = intensity / 100.0

        temp_drop = fraction * factor_temp
        pm_drop = round(fraction * factor_pm)

        sim_temp = round(max(20.0, zone.temp - temp_drop), 1)
        sim_pm = max(5, zone.pm25 - pm_drop)

        SimulationLog.objects.create(
            zone=zone, intervention=intervention, intensity=intensity,
            simulated_temp=sim_temp, simulated_pm25=sim_pm
        )

        return Response({
            "zone_code": zone.code,
            "simulated_temp": sim_temp,
            "simulated_pm25": sim_pm,
            "temp_drop": round(temp_drop, 1),
            "pm_drop": pm_drop
        })

class CopilotAPIView(APIView):
    def post(self, request):
        serializer = CopilotQuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        q = serializer.validated_data['question'].lower()
        zones = Zone.objects.all()
        roads = RoadSegment.objects.all()

        if not zones.exists():
            return Response({"answer": "No campus data loaded yet."})

        if 'tree' in q or 'green' in q:
            z = zones.order_by('tree_cover').first()
            ans = f"The priority area for green intervention is {z.name} with {z.tree_cover}% tree cover and vulnerability {z.vulnerability}/10."
        elif 'air' in q or 'pm' in q or 'pollution' in q:
            z = zones.order_by('-pm25').first()
            ans = f"The highest PM2.5 zone is {z.name} at {z.pm25} µg/m³."
        elif 'temperature' in q or 'heat' in q:
            z = zones.order_by('-temp').first()
            ans = f"The hottest modeled zone is {z.name} at {z.temp}°C."
        elif 'traffic' in q or 'road' in q:
            r = roads.order_by('-traffic').first()
            ans = f"The busiest modeled road is {r.name} with {r.traffic}% traffic." if r else "No road data."
        else:
            ans = "I can analyze air quality, traffic, heat, green cover, risk, and simulations."

        return Response({"answer": ans})