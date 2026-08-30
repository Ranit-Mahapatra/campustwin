from django.contrib import admin
from .models import Zone, RoadSegment, SimulationLog

@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'temp', 'pm25', 'aqi', 'vulnerability', 'confidence')
    search_fields = ('code', 'name')
    list_filter = ('aqi', 'confidence')

@admin.register(RoadSegment)
class RoadSegmentAdmin(admin.ModelAdmin):
    list_display = ('road_id', 'name', 'traffic', 'speed', 'risk')
    list_filter = ('risk',)

@admin.register(SimulationLog)
class SimulationLogAdmin(admin.ModelAdmin):
    list_display = ('zone', 'intervention', 'intensity', 'simulated_temp', 'simulated_pm25', 'created_at')
    list_filter = ('intervention',)