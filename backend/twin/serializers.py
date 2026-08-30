from rest_framework import serializers
from .models import Zone, RoadSegment, SimulationLog


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = [
            'id', 'code', 'name', 'temp', 'pm25',
            'aqi', 'vulnerability', 'tree_cover', 'lat', 'lng'
        ]


class RoadSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadSegment
        fields = ['id', 'name', 'traffic', 'speed', 'noise', 'risk']


class SimulationLogSerializer(serializers.ModelSerializer):
    zone_code = serializers.CharField(source='zone.code', read_only=True)
    zone_name = serializers.CharField(source='zone.name', read_only=True)

    class Meta:
        model = SimulationLog
        fields = [
            'id', 'zone_code', 'zone_name', 'intervention',
            'intensity', 'simulated_temp', 'simulated_pm25', 'created_at'
        ]


class SimulationInputSerializer(serializers.Serializer):
    zone_code = serializers.CharField(max_length=20)
    intervention = serializers.CharField(max_length=50)
    intensity = serializers.IntegerField(min_value=0, max_value=100, default=50)


class CopilotQuerySerializer(serializers.Serializer):
    question = serializers.CharField()