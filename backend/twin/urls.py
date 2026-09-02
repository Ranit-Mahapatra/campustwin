from django.urls import path
from .views import (
    HealthCheckAPIView,
    ZoneListAPIView,
    CampusMetricsAPIView,
    AlertListAPIView,
    RoadListAPIView,
    TrendDataAPIView,
    SimulationAPIView,
    CopilotAPIView,
    SimulationHistoryAPIView,
    ExportSimulationCSVView,
    CampusCatalogAPIView,
    BulkSensorIngestionAPIView,
)

urlpatterns = [
    path('health/', HealthCheckAPIView.as_view(), name='health'),
    path('campuses/', CampusCatalogAPIView.as_view(), name='campuses'),
    path('zones/', ZoneListAPIView.as_view(), name='zones'),
    path('metrics/', CampusMetricsAPIView.as_view(), name='metrics'),
    path('alerts/', AlertListAPIView.as_view(), name='alerts'),
    path('roads/', RoadListAPIView.as_view(), name='roads'),
    path('trends/', TrendDataAPIView.as_view(), name='trends'),
    path('simulate/', SimulationAPIView.as_view(), name='simulate'),
    path('copilot/', CopilotAPIView.as_view(), name='copilot'),
    path('simulations/history/', SimulationHistoryAPIView.as_view(), name='simulation-history'),
    path('simulations/export/', ExportSimulationCSVView.as_view(), name='simulation-export'),
    path('sensors/batch/', BulkSensorIngestionAPIView.as_view(), name='sensor-batch'),
]