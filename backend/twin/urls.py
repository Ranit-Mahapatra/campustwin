from django.urls import path
from .views import (
    HealthCheckAPIView,
    ZoneListAPIView,
    RoadListAPIView,
    CampusMetricsAPIView,
    TrendDataAPIView,
    SimulationAPIView,
    CopilotAPIView,
    SimulationHistoryAPIView,
    ExportSimulationCSVView,
    AlertListAPIView,
)

urlpatterns = [
    path('health/', HealthCheckAPIView.as_view()),
    path('zones/', ZoneListAPIView.as_view()),
    path('roads/', RoadListAPIView.as_view()),
    path('metrics/', CampusMetricsAPIView.as_view()),
    path('trends/', TrendDataAPIView.as_view()),
    path('simulate/', SimulationAPIView.as_view()),
    path('copilot/', CopilotAPIView.as_view()),
    path('simulations/history/', SimulationHistoryAPIView.as_view()),
    path('simulations/export/', ExportSimulationCSVView.as_view()),
    path('alerts/', AlertListAPIView.as_view()),
]