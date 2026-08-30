import { baselineZones } from '../data/baselineZones';
import { baselineRoads } from '../data/baselineRoads';
import { baselineTrendData } from '../data/baselineTrends';
import { calculateSimulation } from '../data/simulationFactors';

const API_BASE = '/api';

/**
 * Fetch all spatial campus zones from Django REST API with fallback to baseline dataset.
 */
export async function fetchZones() {
  try {
    const res = await fetch(`${API_BASE}/zones/`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return baselineZones;
  } catch (err) {
    console.warn('[CampusTwin API] Zones endpoint unreachable, using baseline dataset:', err.message);
    return baselineZones;
  }
}

/**
 * Fetch all road corridors from Django REST API with fallback to baseline dataset.
 */
export async function fetchRoads() {
  try {
    const res = await fetch(`${API_BASE}/roads/`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return baselineRoads;
  } catch (err) {
    console.warn('[CampusTwin API] Roads endpoint unreachable, using baseline dataset:', err.message);
    return baselineRoads;
  }
}

/**
 * Fetch aggregated campus metrics from Django REST API with fallback computation.
 */
export async function fetchCampusMetrics() {
  try {
    const res = await fetch(`${API_BASE}/metrics/`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[CampusTwin API] Metrics endpoint unreachable, computing locally:', err.message);
    const avgTemp = baselineZones.reduce((sum, z) => sum + z.temp, 0) / baselineZones.length;
    const maxPm = Math.max(...baselineZones.map((z) => z.pm25));
    const avgGreen = baselineZones.reduce((sum, z) => sum + z.treeCover, 0) / baselineZones.length;
    const riskCount = baselineZones.filter((z) => z.vulnerability >= 8).length;

    return {
      avg_temp: Number(avgTemp.toFixed(1)),
      max_pm25: maxPm,
      avg_green_cover: Math.round(avgGreen),
      risk_zones_count: riskCount,
      traffic_status: 'HIGH'
    };
  }
}

/**
 * Fetch multi-temporal trend time series (24h or 7d) from Django REST API with fallback.
 */
export async function fetchTrendData(range = '24h') {
  try {
    const res = await fetch(`${API_BASE}/trends/?range=${range}`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[CampusTwin API] Trends endpoint unreachable, using baseline series:', err.message);
    return baselineTrendData[range] || baselineTrendData['24h'];
  }
}

/**
 * Execute digital-twin what-if simulation via Django REST API with client-side mathematical fallback.
 */
export async function postSimulation({ zone_code, intervention, intensity }) {
  try {
    const res = await fetch(`${API_BASE}/simulate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ zone_code, intervention, intensity })
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return {
      interventionKey: intervention,
      intensity: `${intensity}%`,
      intensityValue: intensity,
      tempDrop: data.temp_drop,
      pmDrop: data.pm_drop,
      simTemp: data.simulated_temp,
      simPm: data.simulated_pm25,
      tempImpactPercent: Math.min(100, data.temp_drop * 15),
      pmImpactPercent: Math.min(100, data.pm_drop * 2)
    };
  } catch (err) {
    console.warn('[CampusTwin API] Simulation endpoint unreachable, executing locally:', err.message);
    const targetZone = baselineZones.find((z) => z.code === zone_code) || baselineZones[0];
    return calculateSimulation({
      baseTemp: targetZone.temp,
      basePm: targetZone.pm25,
      intervention,
      intensityPercent: intensity
    });
  }
}

/**
 * Ask CampusTwin Copilot query via Django REST API with client-side NLP fallback.
 */
export async function postCopilotQuery({ question }) {
  try {
    const res = await fetch(`${API_BASE}/copilot/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ question })
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.answer;
  } catch (err) {
    console.warn('[CampusTwin API] Copilot endpoint unreachable, using local parser:', err.message);
    const q = question.toLowerCase();
    if (q.includes('tree') || q.includes('green')) {
      const z = [...baselineZones].sort((a, b) => a.treeCover - b.treeCover)[0];
      return `The top priority area for greening intervention is **${z.name} (${z.code})** with only **${z.treeCover}%** tree canopy cover and vulnerability score **${z.vulnerability}/10**.`;
    } else if (q.includes('air') || q.includes('pm') || q.includes('pollution')) {
      const z = [...baselineZones].sort((a, b) => b.pm25 - a.pm25)[0];
      return `The highest recorded PM2.5 hotspot is **${z.name} (${z.code})** at **${z.pm25} µg/m³** (${z.aqi} AQI category).`;
    } else if (q.includes('temperature') || q.includes('heat') || q.includes('hot')) {
      const z = [...baselineZones].sort((a, b) => b.temp - a.temp)[0];
      return `The hottest modeled campus zone is **${z.name} (${z.code})** reaching **${z.temp}°C**.`;
    } else if (q.includes('traffic') || q.includes('road')) {
      const r = [...baselineRoads].sort((a, b) => b.traffic - a.traffic)[0];
      return `The heaviest traffic corridor is **${r.name} (${r.id})** with **${r.traffic}%** congestion intensity.`;
    }
    return `I can analyze real-time **air quality, traffic corridors, urban heat, green canopy cover, vulnerability ratings**, and **what-if digital twin simulations**.`;
  }
}
