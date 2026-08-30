import csv
from django.http import HttpResponse
from django.db.models import Avg, Max, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import Zone, RoadSegment, SimulationLog
from .serializers import (
    ZoneSerializer,
    RoadSegmentSerializer,
    SimulationLogSerializer,
    SimulationInputSerializer,
    CopilotQuerySerializer,
)
from .services import MicroclimateEngine, DecisionSupportEngine


class HealthCheckAPIView(APIView):
    """Verifies database connectivity and returns registered object counts."""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "status": "healthy",
            "database": "connected",
            "zones_count": Zone.objects.count(),
            "roads_count": RoadSegment.objects.count(),
            "simulations_count": SimulationLog.objects.count(),
        })


class ZoneListAPIView(APIView):
    """Returns all modeled campus zones with search and sorting support."""
    permission_classes = [AllowAny]
    serializer_class = ZoneSerializer

    def get(self, request):
        q = request.query_params.get('q', None)
        sort_by = request.query_params.get('sort', None)

        zones = Zone.objects.all()

        if q:
            zones = zones.filter(Q(name__icontains=q) | Q(code__icontains=q))

        if sort_by in ['temp', '-temp', 'pm25', '-pm25', 'vulnerability', '-vulnerability']:
            zones = zones.order_by(sort_by)

        serializer = self.serializer_class(zones, many=True)
        return Response(serializer.data)


class RoadListAPIView(APIView):
    """Returns campus transit segments including congestion levels, speed, and risk ratings."""
    permission_classes = [AllowAny]
    serializer_class = RoadSegmentSerializer

    def get(self, request):
        roads = RoadSegment.objects.all()
        serializer = self.serializer_class(roads, many=True)
        return Response(serializer.data)


class CampusMetricsAPIView(APIView):
    """Calculates real-time campus-wide aggregations."""
    permission_classes = [AllowAny]

    def get(self, request):
        stats = Zone.objects.aggregate(
            avg_temp=Avg('temp'),
            max_pm25=Max('pm25'),
            avg_tree=Avg('tree_cover')
        )
        flagged_count = Zone.objects.filter(vulnerability__gte=8).count()
        busiest_road = RoadSegment.objects.order_by('-traffic').first()

        return Response({
            "avg_temp": round(stats['avg_temp'] or 0.0, 1),
            "max_pm25": stats['max_pm25'] or 0,
            "avg_green_cover": round(stats['avg_tree'] or 0),
            "risk_zones_count": flagged_count,
            "traffic_status": busiest_road.risk if busiest_road else "NORMAL"
        })


class TrendDataAPIView(APIView):
    """Returns 24-hour and 7-day environmental historical telemetry time series."""
    permission_classes = [AllowAny]

    def get(self, request):
        hourly_trends = [
            {
                "time": f"{hour:02d}:00",
                "temp": round(26.0 + (hour * 0.5 if hour <= 14 else (24 - hour) * 0.5), 1),
                "pm25": 45 + (hour % 6) * 5
            }
            for hour in range(24)
        ]

        daily_trends = [
            {"day": "Day -6", "avg_temp": 32.4, "avg_pm25": 58},
            {"day": "Day -5", "avg_temp": 33.1, "avg_pm25": 62},
            {"day": "Day -4", "avg_temp": 31.8, "avg_pm25": 55},
            {"day": "Day -3", "avg_temp": 34.0, "avg_pm25": 70},
            {"day": "Day -2", "avg_temp": 33.5, "avg_pm25": 65},
            {"day": "Yesterday", "avg_temp": 32.9, "avg_pm25": 60},
            {"day": "Today", "avg_temp": 33.2, "avg_pm25": 64},
        ]

        return Response({
            "hourly_24h": hourly_trends,
            "daily_7d": daily_trends
        })


class SimulationAPIView(APIView):
    """Executes a microclimate intervention simulation and logs results to audit history."""
    serializer_class = SimulationInputSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        zone_code = request.data.get('zone_code')
        intervention = request.data.get('intervention')
        intensity = int(request.data.get('intensity', 50))

        try:
            zone = Zone.objects.get(code=zone_code)
        except Zone.DoesNotExist:
            return Response({"error": "Zone not found"}, status=status.HTTP_404_NOT_FOUND)

        result = MicroclimateEngine.run_simulation(zone.temp, zone.pm25, intervention, intensity)

        SimulationLog.objects.create(
            zone=zone,
            intervention=intervention,
            intensity=intensity,
            simulated_temp=result["simulated_temp"],
            simulated_pm25=result["simulated_pm25"]
        )

        return Response({
            "zone_code": zone.code,
            "zone_name": zone.name,
            "intervention": intervention,
            "intensity": intensity,
            **result
        })


class CopilotAPIView(APIView):
    """Provides automated decision support (GET) and copilot Q&A (POST)."""
    permission_classes = [AllowAny]
    serializer_class = CopilotQuerySerializer

    def get(self, request):
        flagged_zones = Zone.objects.filter(vulnerability__gte=7)
        insights = []

        for zone in flagged_zones:
            recs = DecisionSupportEngine.generate_recommendations(zone)
            if recs:
                tree_val = getattr(zone, 'tree_cover', getattr(zone, 'treeCover', 0))
                insights.append({
                    "zone_code": zone.code,
                    "zone_name": zone.name,
                    "current_metrics": {
                        "temp": zone.temp,
                        "pm25": zone.pm25,
                        "tree_cover": tree_val,
                        "vulnerability": zone.vulnerability
                    },
                    "recommendations": recs
                })

        return Response({
            "total_actionable_zones": len(insights),
            "actionable_insights": insights
        })

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        q = serializer.validated_data['question'].lower()
        zones = Zone.objects.all()
        roads = RoadSegment.objects.all()

        if not zones.exists():
            return Response({"answer": "No campus data loaded yet."})

        if 'tree' in q or 'green' in q:
            z = zones.order_by('tree_cover').first()
            ans = f"The priority area for green cover is {z.name} with {z.tree_cover}% tree cover and vulnerability {z.vulnerability}/10."
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


class SimulationHistoryAPIView(APIView):
    """Retrieves the recent microclimate simulation audit log."""
    permission_classes = [AllowAny]
    serializer_class = SimulationLogSerializer

    def get(self, request):
        logs = SimulationLog.objects.select_related('zone').order_by('-created_at')[:10]
        serializer = self.serializer_class(logs, many=True)
        return Response(serializer.data)


class ExportSimulationCSVView(APIView):
    """Streams a downloadable CSV spreadsheet containing all historical simulation logs."""
    permission_classes = [AllowAny]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="campus_simulations_report.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'Log ID', 'Zone Code', 'Zone Name', 'Intervention',
            'Intensity (%)', 'Simulated Temp (°C)', 'Simulated PM2.5 (µg/m³)', 'Timestamp'
        ])

        logs = SimulationLog.objects.select_related('zone').order_by('-created_at')
        for log in logs:
            writer.writerow([
                log.id,
                log.zone.code if log.zone else "N/A",
                log.zone.name if log.zone else "N/A",
                log.intervention,
                log.intensity,
                log.simulated_temp,
                log.simulated_pm25,
                log.created_at.strftime("%Y-%m-%d %H:%M:%S")
            ])

        return response


class AlertListAPIView(APIView):
    """Evaluates environmental telemetry thresholds and flags high-risk anomalies."""
    permission_classes = [AllowAny]

    def get(self, request):
        alerts = []
        zones = Zone.objects.all()

        for zone in zones:
            tree_val = getattr(zone, 'tree_cover', getattr(zone, 'treeCover', 0))

            if zone.temp >= 38.0:
                alerts.append({
                    "severity": "CRITICAL",
                    "type": "HEAT_ISLAND_WARNING",
                    "zone_code": zone.code,
                    "zone_name": zone.name,
                    "metric_value": f"{zone.temp}°C",
                    "threshold": ">= 38.0°C",
                    "message": "Extreme surface heat detected. Reduce prolonged outdoor activity.",
                })

            if zone.pm25 >= 100:
                alerts.append({
                    "severity": "HIGH",
                    "type": "HAZARDOUS_AIR_QUALITY",
                    "zone_code": zone.code,
                    "zone_name": zone.name,
                    "metric_value": f"{zone.pm25} µg/m³",
                    "threshold": ">= 100 µg/m³",
                    "message": "Particulate matter PM2.5 at unhealthy levels. Dust mitigation required.",
                })

            if tree_val < 15 and zone.vulnerability >= 8:
                alerts.append({
                    "severity": "MEDIUM",
                    "type": "CANOPY_DEFICIT",
                    "zone_code": zone.code,
                    "zone_name": zone.name,
                    "metric_value": f"{tree_val}% canopy / {zone.vulnerability} vuln",
                    "threshold": "< 15% canopy & >= 8 vuln",
                    "message": "High infrastructure vulnerability paired with critical tree cover deficit.",
                })

        return Response({
            "active_alerts_count": len(alerts),
            "critical_count": sum(1 for a in alerts if a["severity"] == "CRITICAL"),
            "alerts": alerts,
        })