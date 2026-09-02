from django.urls import path
from .views import (
    CampusCatalogAPIView,
    HealthCheckAPIView,
    ZoneListAPIView,
    RoadListAPIView,
    CampusMetricsAPIView,
    TrendDataAPIView,
    SimulationAPIView,
    CopilotAPIView,
    AlertListAPIView,
    SimulationHistoryAPIView,
    ExportSimulationCSVView,
    BulkSensorIngestionAPIView,
)

urlpatterns = [
    path('campuses/', CampusCatalogAPIView.as_view(), name='campus-catalog'),
    path('health/', HealthCheckAPIView.as_view(), name='health-check'),
    path('zones/', ZoneListAPIView.as_view(), name='zone-list'),
    path('roads/', RoadListAPIView.as_view(), name='road-list'),
    path('metrics/', CampusMetricsAPIView.as_view(), name='campus-metrics'),
    path('trends/', TrendDataAPIView.as_view(), name='trend-data'),
    path('simulate/', SimulationAPIView.as_view(), name='simulate'),
    path('copilot/', CopilotAPIView.as_view(), name='copilot'),
    path('alerts/', AlertListAPIView.as_view(), name='alerts'),
    path('simulations/history/', SimulationHistoryAPIView.as_view(), name='simulation-history'),
    path('simulations/export/', ExportSimulationCSVView.as_view(), name='simulation-export'),
    path('sensors/batch/', BulkSensorIngestionAPIView.as_view(), name='sensor-bulk-ingest'),
]