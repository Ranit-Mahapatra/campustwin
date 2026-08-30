import time
import random
from django.core.management.base import BaseCommand
from twin.models import Zone

class Command(BaseCommand):
    help = "Simulates real-time IoT microclimate telemetry fluctuations"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting CampusTwin Live IoT Stream... (Press Ctrl+C to stop)"))

        while True:
            zones = Zone.objects.all()
            if not zones.exists():
                self.stdout.write(self.style.WARNING("No zones found in database to simulate."))
                time.sleep(3)
                continue

            for zone in zones:
                temp_delta = round(random.uniform(-0.2, 0.2), 1)
                pm_delta = random.randint(-2, 2)

                zone.temp = round(max(20.0, min(45.0, zone.temp + temp_delta)), 1)
                zone.pm25 = max(5, min(200, zone.pm25 + pm_delta))
                zone.save(update_fields=['temp', 'pm25'])

            self.stdout.write(self.style.NOTICE(f"Live Telemetry Tick: Updated {zones.count()} campus zones."))
            time.sleep(3)