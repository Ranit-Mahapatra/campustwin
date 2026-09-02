import time
import random
from django.core.management.base import BaseCommand
from twin.models import Zone
from twin.services import AirQualityEngine

class Command(BaseCommand):
    help = "Simulates real-time IoT microclimate telemetry with sudden spike detection"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting CampusTwin Live IoT Stream with Dynamic AQI & Spike Detection... (Ctrl+C to stop)"))

        # In-memory dictionary tracking previous values for rate-of-change analysis
        prev_readings = {}

        try:
            while True:
                zones = Zone.objects.all()
                if not zones.exists():
                    self.stdout.write(self.style.WARNING("No zones found in database to simulate."))
                    time.sleep(3)
                    continue

                for zone in zones:
                    prev_pm = prev_readings.get(zone.code, zone.pm25)

                    # 10% chance to simulate a sudden localized pollution event (+20 to +40 ug/m3)
                    if random.random() < 0.10:
                        pm_delta = random.randint(20, 40)
                        self.stdout.write(self.style.WARNING(f"⚠️ SUDDEN SPIKE INJECTED: Zone {zone.code} surge (+{pm_delta} µg/m³)"))
                    else:
                        pm_delta = random.randint(-2, 2)

                    temp_delta = round(random.uniform(-0.2, 0.2), 1)

                    # Apply updates and clamp within physical baselines
                    zone.temp = round(max(20.0, min(45.0, zone.temp + temp_delta)), 1)
                    zone.pm25 = max(5, min(250, zone.pm25 + pm_delta))

                    # 1. Dynamic AQI update based on new PM2.5
                    zone.aqi = AirQualityEngine.calculate_aqi(zone.pm25)

                    # 2. Rate-of-change sudden spike check
                    is_spike, delta = AirQualityEngine.evaluate_sudden_change(zone.pm25, prev_pm, threshold=15.0)
                    if is_spike:
                        zone.reason = f"ALERT: Sudden telemetry surge of +{delta} µg/m³ detected"
                    elif zone.reason and "Sudden telemetry surge" in zone.reason:
                        # Clear old spike reason once stabilized
                        zone.reason = ""

                    zone.save(update_fields=['temp', 'pm25', 'aqi', 'reason'])
                    prev_readings[zone.code] = zone.pm25

                self.stdout.write(self.style.NOTICE(f"Live Telemetry Tick: Processed {zones.count()} campus zones with dynamic AQI."))
                time.sleep(3)
        except KeyboardInterrupt:
            self.stdout.write(self.style.SUCCESS("\nLive IoT stream stopped cleanly."))