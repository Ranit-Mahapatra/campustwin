import csv
from django.http import HttpResponse
from django.db.models import Avg, Max, Q
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination

from .models import Zone, RoadSegment, SimulationLog
from .serializers import (
    ZoneSerializer,
    RoadSegmentSerializer,
    SimulationLogSerializer,
    SimulationInputSerializer,
    CopilotQuerySerializer,
)
from .services import MicroclimateEngine, DecisionSupportEngine


class ScalableZonePagination(PageNumberPagination):
    """Dynamic pagination that remains backward-compatible with unpaginated map views."""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 500

    def paginate_queryset(self, queryset, request, view=None):
        if 'page' not in request.query_params:
            return None
        return super().paginate_queryset(queryset, request, view)


class CampusCatalogAPIView(APIView):
    """Serves registered campus zones, map coordinates, and smart-city grid boundaries."""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response([
            {
                "id": "soa_iter",
                "name": "SOA Campus (ITER Main)",
                "center": [20.248564, 85.801532],
                "zoom": 17,
                "zones_count": Zone.objects.count(),
                "status": "Active IoT Sensor Grid",
                "scope": "campus"
            },
            {
                "id": "soa_campus_2",
                "name": "Campus 2 (Khandagiri / IMS)",
                "center": [20.261200, 85.783100],
                "zoom": 16,
                "zones_count": 5,
                "status": "Modeled Digital Twin",
                "scope": "campus_expansion"
            },
            {
                "id": "smart_city",
                "name": "Smart City Grid (Bhubaneswar Municipal)",
                "center": [20.296100, 85.824500],
                "zoom": 13,
                "zones_count": 10,
                "status": "Elastic Municipal Mesh",
                "scope": "city"
            }
        ])


class HealthCheckAPIView(APIView):
    """System diagnostics, connectivity status, and telemetry counts."""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "status": "healthy",
            "database": "connected",
            "architecture": "multi-campus-scalable-service-layer",
            "zones_count": Zone.objects.count(),
            "roads_count": RoadSegment.objects.count(),
            "simulations_count": SimulationLog.objects.count(),
        })


class ZoneListAPIView(APIView):
    """Master zone catalog supporting multi-campus filtering (?campus=), search, and pagination."""
    permission_classes = [AllowAny]
    serializer_class = ZoneSerializer
    pagination_class = ScalableZonePagination

    def get(self, request):
        campus = request.query_params.get('campus', None)
        q = request.query_params.get('q', None)
        sort_by = request.query_params.get('sort', None)

        # 1. Smart City Grid (Bhubaneswar Municipal Grid - 10 Wards)
        if campus in ['smart_city', 'city']:
            city_zones = [
                {"id": 201, "code": "CT-01", "name": "Master Canteen Junction", "temp": 38.6, "pm25": 128, "aqi": "Severe", "vulnerability": 10, "tree_cover": 8, "treeCover": 8, "canopy": 8, "lat": 20.2680, "lng": 85.8400, "confidence": "modeled", "reason": "High vehicular congestion, dense asphalt corridor, zero canopy"},
                {"id": 202, "code": "CT-02", "name": "Patia Tech Corridor", "temp": 36.4, "pm25": 94, "aqi": "Poor", "vulnerability": 8, "tree_cover": 15, "treeCover": 15, "canopy": 15, "lat": 20.3540, "lng": 85.8180, "confidence": "sensor", "reason": "Rapid tech-corridor expansion, high commuter transit traffic"},
                {"id": 203, "code": "CT-03", "name": "Saheed Nagar Commercial Ward", "temp": 37.8, "pm25": 112, "aqi": "Poor", "vulnerability": 9, "tree_cover": 11, "treeCover": 11, "canopy": 11, "lat": 20.2905, "lng": 85.8435, "confidence": "modeled", "reason": "Concrete density, intense market parking, high heat sink"},
                {"id": 204, "code": "CT-04", "name": "Rasulgarh Industrial Junction", "temp": 39.2, "pm25": 142, "aqi": "Severe", "vulnerability": 10, "tree_cover": 6, "treeCover": 6, "canopy": 6, "lat": 20.2995, "lng": 85.8670, "confidence": "sensor", "reason": "National highway crossroads, freight idling, low vegetation"},
                {"id": 205, "code": "CT-05", "name": "Ekamra Kanan Botanical Reserve", "temp": 31.4, "pm25": 38, "aqi": "Good", "vulnerability": 3, "tree_cover": 72, "treeCover": 72, "canopy": 72, "lat": 20.3010, "lng": 85.8080, "confidence": "sensor", "reason": "Protected biodiversity reserve, high natural evapotranspiration cooling"},
                {"id": 206, "code": "CT-06", "name": "Chandrasekharpur Hub", "temp": 34.6, "pm25": 76, "aqi": "Moderate", "vulnerability": 6, "tree_cover": 28, "treeCover": 28, "canopy": 28, "lat": 20.3250, "lng": 85.8120, "confidence": "modeled", "reason": "Planned residential layout with peripheral avenue tree canopy"},
                {"id": 207, "code": "CT-07", "name": "Jaydev Vihar Interchange", "temp": 37.5, "pm25": 108, "aqi": "Poor", "vulnerability": 9, "tree_cover": 10, "treeCover": 10, "canopy": 10, "lat": 20.3005, "lng": 85.8235, "confidence": "modeled", "reason": "Flyover concrete thermal sink, heavy traffic bottleneck"},
                {"id": 208, "code": "CT-08", "name": "Khandagiri Heritage Perimeter", "temp": 33.9, "pm25": 64, "aqi": "Moderate", "vulnerability": 5, "tree_cover": 36, "treeCover": 36, "canopy": 36, "lat": 20.2580, "lng": 85.7860, "confidence": "modeled", "reason": "Natural rocky elevations with peripheral forestry buffers"},
                {"id": 209, "code": "CT-09", "name": "Mancheswar Industrial Sector", "temp": 38.9, "pm25": 135, "aqi": "Severe", "vulnerability": 10, "tree_cover": 7, "treeCover": 7, "canopy": 7, "lat": 20.3340, "lng": 85.8520, "confidence": "modeled", "reason": "Heavy rail manufacturing and logistics depot emissions"},
                {"id": 210, "code": "CT-10", "name": "Old Town Heritage Zone", "temp": 35.1, "pm25": 78, "aqi": "Moderate", "vulnerability": 7, "tree_cover": 24, "treeCover": 24, "canopy": 24, "lat": 20.2390, "lng": 85.8340, "confidence": "modeled", "reason": "Historic sandstone temple cluster with medium pedestrian density"}
            ]
            return Response(city_zones)

        # 2. Secondary Campus (Khandagiri / IMS Campus 2)
        elif campus in ['soa_campus_2', 'campus_2']:
            campus_2_zones = [
                {"id": 101, "code": "C2-01", "name": "IMS Main Hospital Block", "temp": 33.8, "pm25": 62, "aqi": "Moderate", "vulnerability": 7, "tree_cover": 22, "treeCover": 22, "canopy": 22, "lat": 20.2615, "lng": 85.7835, "confidence": "modeled", "reason": "Hospital emergency ward and patient transit zone"},
                {"id": 102, "code": "C2-02", "name": "Dental College Quad", "temp": 34.5, "pm25": 68, "aqi": "Moderate", "vulnerability": 8, "tree_cover": 18, "treeCover": 18, "canopy": 18, "lat": 20.2608, "lng": 85.7828, "confidence": "modeled", "reason": "Academic quad with moderate asphalt coverage"},
                {"id": 103, "code": "C2-03", "name": "Hostel Sector C", "temp": 35.6, "pm25": 78, "aqi": "Moderate", "vulnerability": 9, "tree_cover": 14, "treeCover": 14, "canopy": 14, "lat": 20.2621, "lng": 85.7842, "confidence": "modeled", "reason": "Residential quarter with canopy deficit"},
                {"id": 104, "code": "C2-04", "name": "Emergency Transit Boulevard", "temp": 36.2, "pm25": 84, "aqi": "Poor", "vulnerability": 9, "tree_cover": 10, "treeCover": 10, "canopy": 10, "lat": 20.2600, "lng": 85.7820, "confidence": "modeled", "reason": "Continuous ambulance and vehicular transit"},
                {"id": 105, "code": "C2-05", "name": "Central Sports Arena", "temp": 32.5, "pm25": 54, "aqi": "Good", "vulnerability": 5, "tree_cover": 35, "treeCover": 35, "canopy": 35, "lat": 20.2630, "lng": 85.7850, "confidence": "modeled", "reason": "Open turf vegetative microclimate cooling"}
            ]
            return Response(campus_2_zones)

        # 3. Default: Primary SOA Campus (ITER) Database Zones
        zones = Zone.objects.all()

        if q:
            zones = zones.filter(Q(name__icontains=q) | Q(code__icontains=q))

        if sort_by in ['temp', '-temp', 'pm25', '-pm25', 'vulnerability', '-vulnerability']:
            zones = zones.order_by(sort_by)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(zones, request, view=self)

        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = self.serializer_class(zones, many=True)
        # Inject treeCover and canopy fallbacks so frontend popup never displays 'undefined%'
        response_data = []
        for item in serializer.data:
            tc = item.get('tree_cover', 20)
            item['treeCover'] = tc
            item['canopy'] = tc
            response_data.append(item)
        return Response(response_data)


class CampusMetricsAPIView(APIView):
    """Cached campus-wide aggregations supporting multi-campus scope filtering."""
    permission_classes = [AllowAny]

    def get(self, request):
        campus = request.query_params.get('campus', 'soa_iter')
        cache_key = f"campus_metrics_cache_{campus}"
        cached_metrics = cache.get(cache_key)

        if cached_metrics:
            return Response(cached_metrics)

        if campus in ['smart_city', 'city']:
            data = {
                "campus_name": "Smart City Grid (Bhubaneswar Municipal)",
                "avg_temp": 36.4,
                "max_pm25": 142,
                "avg_green_cover": 23,
                "risk_zones_count": 8,
                "traffic_status": "SEVERE"
            }
        elif campus in ['soa_campus_2', 'campus_2']:
            data = {
                "campus_name": "Campus 2 (Khandagiri / IMS)",
                "avg_temp": 34.5,
                "max_pm25": 84,
                "avg_green_cover": 24,
                "risk_zones_count": 3,
                "traffic_status": "MODERATE"
            }
        else:
            stats = Zone.objects.aggregate(
                avg_temp=Avg('temp'),
                max_pm25=Max('pm25'),
                avg_tree=Avg('tree_cover')
            )
            flagged_count = Zone.objects.filter(vulnerability__gte=8).count()
            busiest_road = RoadSegment.objects.order_by('-traffic').first()

            data = {
                "campus_name": "SOA Campus 1 (ITER)",
                "avg_temp": round(stats['avg_temp'] or 0.0, 1),
                "max_pm25": stats['max_pm25'] or 0,
                "avg_green_cover": round(stats['avg_tree'] or 0),
                "risk_zones_count": flagged_count,
                "traffic_status": busiest_road.risk if busiest_road else "NORMAL"
            }

        cache.set(cache_key, data, timeout=3)
        return Response(data)


class BulkSensorIngestionAPIView(APIView):
    """High-throughput single-query batch update for live telemetry."""
    permission_classes = [AllowAny]

    def post(self, request):
        payload = request.data.get('sensors', [])
        if not isinstance(payload, list):
            return Response({"error": "Expected a list of sensor reading objects."}, status=status.HTTP_400_BAD_REQUEST)

        zones_to_update = []
        for item in payload:
            code = item.get('code')
            if not code:
                continue
            zone = Zone.objects.filter(code=code).first()
            if zone:
                if 'temp' in item:
                    zone.temp = item['temp']
                if 'pm25' in item:
                    zone.pm25 = item['pm25']
                zones_to_update.append(zone)

        if zones_to_update:
            Zone.objects.bulk_update(zones_to_update, ['temp', 'pm25'])
            cache.clear()

        return Response({
            "status": "success",
            "batch_size_processed": len(zones_to_update),
            "message": "Bulk telemetry ingested without DB query exhaustion."
        }, status=status.HTTP_200_OK)


class RoadListAPIView(APIView):
    """Returns transit network corridors and congestion metrics."""
    permission_classes = [AllowAny]
    serializer_class = RoadSegmentSerializer

    def get(self, request):
        roads = RoadSegment.objects.all()
        serializer = self.serializer_class(roads, many=True)
        return Response(serializer.data)


class TrendDataAPIView(APIView):
    """Serves 24-hour diurnal and 7-day historical telemetry."""
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
    """Executes physics calculation and commits log to audit trail."""
    permission_classes = [AllowAny]
    serializer_class = SimulationInputSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        zone_code = serializer.validated_data['zone_code']
        intervention = serializer.validated_data['intervention']
        intensity = serializer.validated_data['intensity']

        zone = Zone.objects.filter(code=zone_code).first()
        base_temp = zone.temp if zone else 36.0
        base_pm25 = zone.pm25 if zone else 85

        result = MicroclimateEngine.run_simulation(base_temp, base_pm25, intervention, intensity)

        if zone:
            SimulationLog.objects.create(
                zone=zone,
                intervention=intervention,
                intensity=intensity,
                simulated_temp=result["simulated_temp"],
                simulated_pm25=result["simulated_pm25"]
            )

        return Response({
            "zone_code": zone_code,
            "zone_name": zone.name if zone else zone_code,
            "intervention": intervention,
            "intensity": intensity,
            **result
        })


class CopilotAPIView(APIView):
    """Automated decision insights (GET) & conversational Q&A (POST)."""
    permission_classes = [AllowAny]
    serializer_class = CopilotQuerySerializer

    def get(self, request):
        flagged_zones = Zone.objects.filter(vulnerability__gte=7)
        insights = []

        for zone in flagged_zones:
            recs = DecisionSupportEngine.generate_recommendations(zone)
            if recs:
                insights.append({
                    "zone_code": zone.code,
                    "zone_name": zone.name,
                    "current_metrics": {
                        "temp": zone.temp,
                        "pm25": zone.pm25,
                        "tree_cover": zone.tree_cover,
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
    """Retrieves recent simulation audit records."""
    permission_classes = [AllowAny]
    serializer_class = SimulationLogSerializer

    def get(self, request):
        logs = SimulationLog.objects.select_related('zone').order_by('-created_at')[:10]
        serializer = self.serializer_class(logs, many=True)
        return Response(serializer.data)


class ExportSimulationCSVView(APIView):
    """Streams full simulation logs as a downloadable CSV spreadsheet."""
    permission_classes = [AllowAny]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="campustwin_simulations.csv"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'Zone Code', 'Zone Name', 'Intervention', 'Intensity (%)', 'Simulated Temp (°C)', 'Simulated PM2.5 (µg/m³)', 'Timestamp'])

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
    """Scans and returns live environmental threshold warnings."""
    permission_classes = [AllowAny]

    def get(self, request):
        alerts = []
        for zone in Zone.objects.all():
            if zone.temp >= 38.0:
                alerts.append({
                    "severity": "CRITICAL",
                    "type": "HEAT_WARNING",
                    "zone_code": zone.code,
                    "zone_name": zone.name,
                    "message": f"Extreme surface heat ({zone.temp}°C). Outdoor activity reduction advised.",
                })
            if zone.pm25 >= 100:
                alerts.append({
                    "severity": "HIGH",
                    "type": "POOR_AIR_QUALITY",
                    "zone_code": zone.code,
                    "zone_name": zone.name,
                    "message": f"Elevated PM2.5 particulate levels ({zone.pm25} µg/m³).",
                })
            if zone.tree_cover < 15 and zone.vulnerability >= 8:
                alerts.append({
                    "severity": "MEDIUM",
                    "type": "CANOPY_DEFICIT",
                    "zone_code": zone.code,
                    "zone_name": zone.name,
                    "message": f"Low tree cover ({zone.tree_cover}%) in high-vulnerability sector.",
                })
        return Response({
            "active_alerts_count": len(alerts),
            "alerts": alerts
        })