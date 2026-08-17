from django.db import models

class Zone(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=150)
    lat = models.FloatField()
    lng = models.FloatField()
    temp = models.FloatField()
    pm25 = models.IntegerField()
    aqi = models.CharField(max_length=20, default='Moderate')
    confidence = models.CharField(max_length=20, default='sensor')
    vulnerability = models.IntegerField(default=5)
    tree_cover = models.IntegerField(default=20)
    reason = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class RoadSegment(models.Model):
    road_id = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=150)
    from_point = models.CharField(max_length=100)
    to_point = models.CharField(max_length=100)
    traffic = models.IntegerField()
    speed = models.IntegerField()
    noise = models.IntegerField()
    risk = models.CharField(max_length=10, default='MODERATE')
    coordinates = models.JSONField(default=list)

    def __str__(self):
        return f"{self.road_id} - {self.name}"

class SimulationLog(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    intervention = models.CharField(max_length=20)
    intensity = models.IntegerField()
    simulated_temp = models.FloatField()
    simulated_pm25 = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)