class MicroclimateEngine:
    """Core physics and heuristic calculations for campus interventions."""

    COEFFICIENTS = {
        'trees': {'temp': 0.04, 'pm': 0.35},
        'cool_roof': {'temp': 0.05, 'pm': 0.05},
        'misting': {'temp': 0.06, 'pm': 0.40},
        'traffic_diversion': {'temp': 0.02, 'pm': 0.50},
        'green_corridor': {'temp': 0.045, 'pm': 0.30},
    }

    @classmethod
    def run_simulation(cls, base_temp, base_pm25, intervention, intensity):
        rates = cls.COEFFICIENTS.get(intervention, {'temp': 0.03, 'pm': 0.20})
        temp_drop = round(intensity * rates['temp'], 2)
        pm_drop = round(intensity * rates['pm'])

        return {
            "temp_drop": temp_drop,
            "pm_drop": pm_drop,
            "simulated_temp": round(max(20.0, base_temp - temp_drop), 1),
            "simulated_pm25": max(5, base_pm25 - pm_drop)
        }


class DecisionSupportEngine:
    """Analyzes zone risk metrics and generates ranked intervention strategies."""

    @staticmethod
    def generate_recommendations(zone):
        recommendations = []
        tree_val = getattr(zone, 'tree_cover', getattr(zone, 'treeCover', 0))

        # Rule 1: Extreme heat & low tree cover
        if zone.temp >= 36.0 and tree_val < 20:
            recommendations.append({
                "priority": "HIGH",
                "action": "Urban Tree Canopy Expansion",
                "recommended_intervention": "trees",
                "target_intensity": 70,
                "projected_temp_drop": "-2.8°C",
                "rationale": f"Zone exhibits elevated surface heat ({zone.temp}°C) and low tree cover ({tree_val}%)."
            })

        # Rule 2: High particulate matter
        if zone.pm25 >= 80:
            recommendations.append({
                "priority": "HIGH",
                "action": "Dust Suppression & Anti-Smog Misting",
                "recommended_intervention": "misting",
                "target_intensity": 60,
                "projected_pm_drop": "-24 µg/m³",
                "rationale": f"PM2.5 level ({zone.pm25} µg/m³) exceeds safe air quality thresholds."
            })

        # Rule 3: High vulnerability infrastructure
        if zone.vulnerability >= 8:
            recommendations.append({
                "priority": "MEDIUM",
                "action": "High-Albedo Cool Roof Coating",
                "recommended_intervention": "cool_roof",
                "target_intensity": 50,
                "projected_temp_drop": "-2.5°C",
                "rationale": f"Structural vulnerability score ({zone.vulnerability}/10) requires thermal surface intervention."
            })

        return recommendations


class AirQualityEngine:
    """Calculates official AQI bands and detects rapid sensor rate-of-change spikes."""

    @staticmethod
    def calculate_aqi(pm25):
        """Maps PM2.5 (ug/m3) to standard National Air Quality Index (NAQI) categories."""
        if pm25 <= 30:
            return "Good"
        elif pm25 <= 60:
            return "Satisfactory"
        elif pm25 <= 90:
            return "Moderate"
        elif pm25 <= 120:
            return "Poor"
        elif pm25 <= 250:
            return "Very Poor"
        return "Severe"

    @staticmethod
    def evaluate_sudden_change(current_val, previous_val, threshold=15.0):
        """Flags abrupt telemetry surges indicating localized fire, emissions, or sensor faults."""
        if previous_val is None:
            return False, 0.0
        delta = round(current_val - previous_val, 1)
        is_spike = delta >= threshold
        return is_spike, delta