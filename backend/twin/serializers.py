from rest_framework import serializers
from .models import Zone, RoadSegment

class ZoneSerializer(serializers.ModelSerializer):
    treeCover = serializers.IntegerField(source='tree_cover')

    class Meta:
        model = Zone
        fields = [
            'id', 'code', 'name', 'lat', 'lng',
            'temp', 'pm25', 'aqi', 'confidence',
            'vulnerability', 'treeCover', 'reason'
        ]

class RoadSegmentSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='road_id')

    class Meta:
        model = RoadSegment
        fields = ['id', 'name', 'from_point', 'to_point', 'traffic', 'speed', 'noise', 'risk', 'coordinates']

class SimulationInputSerializer(serializers.Serializer):
    zone_code = serializers.CharField(max_length=10)
    intervention = serializers.ChoiceField(choices=['trees', 'shade', 'traffic', 'roof'])
    intensity = serializers.IntegerField(min_value=10, max_value=100)

class CopilotQuerySerializer(serializers.Serializer):
    question = serializers.CharField(max_length=300)