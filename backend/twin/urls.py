from django.urls import path
from .views import (
    ZoneListAPIView, RoadListAPIView, CampusMetricsAPIView,
    TrendDataAPIView, SimulationAPIView, CopilotAPIView
)

urlpatterns = [
    path('zones/', ZoneListAPIView.as_view()),
    path('roads/', RoadListAPIView.as_view()),
    path('metrics/', CampusMetricsAPIView.as_view()),
    path('trends/', TrendDataAPIView.as_view()),
    path('simulate/', SimulationAPIView.as_view()),
    path('copilot/', CopilotAPIView.as_view()),
]