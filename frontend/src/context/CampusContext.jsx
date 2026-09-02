import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { baselineZones } from '../data/baselineZones';
import { baselineRoads } from '../data/baselineRoads';
import { useZonesQuery, useRoadsQuery } from '../hooks/useCampusApi';

const CampusContext = createContext(null);

export const CAMPUS_REGISTRY = {
  soa_iter: {
    id: 'soa_iter',
    name: 'SOA Campus',
    center: [20.248564, 85.801532],
    zoom: 17,
  },
  soa_campus_2: {
    id: 'soa_campus_2',
    name: 'Campus 2',
    center: [20.261200, 85.783100],
    zoom: 16,
  },
  smart_city: {
    id: 'smart_city',
    name: 'Smart City Grid',
    center: [20.296100, 85.824500],
    zoom: 13,
  }
};

// 1. Campus 2 Offline Fallback (With treeCover + canopy keys populated)
const campus2FallbackZones = [
  { id: 101, code: "C2-01", name: "IMS Main Hospital Block", temp: 33.8, pm25: 62, aqi: "Moderate", vulnerability: 7, tree_cover: 22, treeCover: 22, canopy: 22, lat: 20.2615, lng: 85.7835, confidence: "modeled", reason: "Hospital emergency ward and patient transit zone" },
  { id: 102, code: "C2-02", name: "Dental College Quad", temp: 34.5, pm25: 68, aqi: "Moderate", vulnerability: 8, tree_cover: 18, treeCover: 18, canopy: 18, lat: 20.2608, lng: 85.7828, confidence: "modeled", reason: "Academic quad with moderate asphalt coverage" },
  { id: 103, code: "C2-03", name: "Hostel Sector C", temp: 35.6, pm25: 78, aqi: "Moderate", vulnerability: 9, tree_cover: 14, treeCover: 14, canopy: 14, lat: 20.2621, lng: 85.7842, confidence: "modeled", reason: "Residential quarter with canopy deficit" },
  { id: 104, code: "C2-04", name: "Emergency Transit Boulevard", temp: 36.2, pm25: 84, aqi: "Poor", vulnerability: 9, tree_cover: 10, treeCover: 10, canopy: 10, lat: 20.2600, lng: 85.7820, confidence: "modeled", reason: "Continuous ambulance and vehicular transit" },
  { id: 105, code: "C2-05", name: "Central Sports Arena", temp: 32.5, pm25: 54, aqi: "Good", vulnerability: 5, tree_cover: 35, treeCover: 35, canopy: 35, lat: 20.2630, lng: 85.7850, confidence: "modeled", reason: "Open turf vegetative microclimate cooling" }
];

// 2. Smart City Grid (Bhubaneswar Municipal Wards - 10 Sectors)
const smartCityFallbackZones = [
  { id: 201, code: "CT-01", name: "Master Canteen Junction", temp: 38.6, pm25: 128, aqi: "Severe", vulnerability: 10, tree_cover: 8, treeCover: 8, canopy: 8, lat: 20.2680, lng: 85.8400, confidence: "modeled", reason: "High vehicular congestion, dense asphalt corridor, zero canopy" },
  { id: 202, code: "CT-02", name: "Patia Tech Corridor", temp: 36.4, pm25: 94, aqi: "Poor", vulnerability: 8, tree_cover: 15, treeCover: 15, canopy: 15, lat: 20.3540, lng: 85.8180, confidence: "sensor", reason: "Rapid tech-corridor expansion, high commuter transit traffic" },
  { id: 203, code: "CT-03", name: "Saheed Nagar Commercial Ward", temp: 37.8, pm25: 112, aqi: "Poor", vulnerability: 9, tree_cover: 11, treeCover: 11, canopy: 11, lat: 20.2905, lng: 85.8435, confidence: "modeled", reason: "Concrete density, intense market parking, high heat sink" },
  { id: 204, code: "CT-04", name: "Rasulgarh Industrial Junction", temp: 39.2, pm25: 142, aqi: "Severe", vulnerability: 10, tree_cover: 6, treeCover: 6, canopy: 6, lat: 20.2995, lng: 85.8670, confidence: "sensor", reason: "National highway crossroads, freight idling, low vegetation" },
  { id: 205, code: "CT-05", name: "Ekamra Kanan Botanical Reserve", temp: 31.4, pm25: 38, aqi: "Good", vulnerability: 3, tree_cover: 72, treeCover: 72, canopy: 72, lat: 20.3010, lng: 85.8080, confidence: "sensor", reason: "Protected biodiversity reserve, high natural evapotranspiration cooling" },
  { id: 206, code: "CT-06", name: "Chandrasekharpur Hub", temp: 34.6, pm25: 76, aqi: "Moderate", vulnerability: 6, tree_cover: 28, treeCover: 28, canopy: 28, lat: 20.3250, lng: 85.8120, confidence: "modeled", reason: "Planned residential layout with peripheral avenue tree canopy" },
  { id: 207, code: "CT-07", name: "Jaydev Vihar Interchange", temp: 37.5, pm25: 108, aqi: "Poor", vulnerability: 9, tree_cover: 10, treeCover: 10, canopy: 10, lat: 20.3005, lng: 85.8235, confidence: "modeled", reason: "Flyover concrete thermal sink, heavy traffic bottleneck" },
  { id: 208, code: "CT-08", name: "Khandagiri Heritage Perimeter", temp: 33.9, pm25: 64, aqi: "Moderate", vulnerability: 5, tree_cover: 36, treeCover: 36, canopy: 36, lat: 20.2580, lng: 85.7860, confidence: "modeled", reason: "Natural rocky elevations with peripheral forestry buffers" },
  { id: 209, code: "CT-09", name: "Mancheswar Industrial Sector", temp: 38.9, pm25: 135, aqi: "Severe", vulnerability: 10, tree_cover: 7, treeCover: 7, canopy: 7, lat: 20.3340, lng: 85.8520, confidence: "modeled", reason: "Heavy rail manufacturing and logistics depot emissions" },
  { id: 210, code: "CT-10", name: "Old Town Heritage Zone", temp: 35.1, pm25: 78, aqi: "Moderate", vulnerability: 7, tree_cover: 24, treeCover: 24, canopy: 24, lat: 20.2390, lng: 85.8340, confidence: "modeled", reason: "Historic sandstone temple cluster with medium pedestrian density" }
];

export function CampusProvider({ children }) {
  const { data: apiZones, isSuccess: isZonesSuccess } = useZonesQuery();
  const { data: apiRoads, isSuccess: isRoadsSuccess } = useRoadsQuery();

  const [selectedCampus, setSelectedCampusState] = useState('soa_iter');
  const [mapCenter, setMapCenter] = useState(CAMPUS_REGISTRY.soa_iter.center);
  const [mapZoom, setMapZoom] = useState(CAMPUS_REGISTRY.soa_iter.zoom);

  const [zones, setZones] = useState(baselineZones);
  const [selectedZone, setSelectedZone] = useState(
    baselineZones.find((z) => z.code === 'Z-18') || baselineZones[0]
  );
  const [roads, setRoads] = useState(baselineRoads);
  const [selectedRoad, setSelectedRoad] = useState(baselineRoads[0]);
  const [activeMapLayer, setActiveMapLayer] = useState('campus');
  const [activeModuleLayer, setActiveModuleLayer] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlert, setActiveAlert] = useState(null);

  // Exact normalizer prioritizing Smart City Grid
  const normalizeCampusKey = (val) => {
    if (!val) return 'soa_iter';
    const str = String(val).toLowerCase();
    if (str.includes('city') || str.includes('smart')) return 'smart_city';
    if (str.includes('2')) return 'soa_campus_2';
    return 'soa_iter';
  };

  const switchCampus = useCallback(async (newCampusRaw) => {
    const campusKey = normalizeCampusKey(newCampusRaw);
    setSelectedCampusState(campusKey);

    const config = CAMPUS_REGISTRY[campusKey] || CAMPUS_REGISTRY.soa_iter;
    setMapCenter(config.center);
    setMapZoom(config.zoom);

    // Instant UI Fallback so the map and markers update with 0ms delay
    if (campusKey === 'smart_city') {
      setZones(smartCityFallbackZones);
      setSelectedZone(smartCityFallbackZones[0]);
    } else if (campusKey === 'soa_campus_2') {
      setZones(campus2FallbackZones);
      setSelectedZone(campus2FallbackZones[0]);
    } else {
      setZones(baselineZones);
      setSelectedZone(baselineZones.find((z) => z.code === 'Z-18') || baselineZones[0]);
    }

    // Backend sync
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/zones/?campus=${campusKey}`);
      if (res.ok) {
        const data = await res.json();
        const zonesList = Array.isArray(data) ? data : data.results || [];
        if (zonesList.length > 0) {
          // Normalize canopy keys so undefined% is eliminated permanently
          const normalized = zonesList.map((z) => {
            const val = z.tree_cover ?? z.treeCover ?? z.canopy ?? 20;
            return { ...z, tree_cover: val, treeCover: val, canopy: val };
          });
          setZones(normalized);
          setSelectedZone(normalized[0]);
        }
      }
    } catch (err) {
      console.warn("Backend campus fetch fallback:", err);
    }
  }, []);

  const setSelectedCampus = (val) => {
    switchCampus(val);
  };

  useEffect(() => {
    if (selectedCampus === 'soa_iter' && isZonesSuccess && Array.isArray(apiZones) && apiZones.length > 0) {
      const normalized = apiZones.map((z) => {
        const val = z.tree_cover ?? z.treeCover ?? z.canopy ?? 20;
        return { ...z, tree_cover: val, treeCover: val, canopy: val };
      });
      setZones(normalized);
      setSelectedZone((prev) => normalized.find((z) => z.code === prev?.code) || normalized[0]);
    }
  }, [apiZones, isZonesSuccess, selectedCampus]);

  useEffect(() => {
    if (isRoadsSuccess && Array.isArray(apiRoads) && apiRoads.length > 0) {
      setRoads(apiRoads);
      setSelectedRoad((prev) => apiRoads.find((r) => r.id === prev?.id) || apiRoads[0]);
    }
  }, [apiRoads, isRoadsSuccess]);

  const selectZoneByCode = (code) => {
    const found = zones.find((z) => z.code === code);
    if (found) setSelectedZone(found);
  };

  const selectRoadById = (id) => {
    const found = roads.find((r) => r.id === id);
    if (found) setSelectedRoad(found);
  };

  const value = {
    selectedCampus,
    setSelectedCampus,
    activeCampus: selectedCampus,
    setActiveCampus: setSelectedCampus,
    switchCampus,
    mapCenter,
    setMapCenter,
    mapZoom,
    setMapZoom,
    campuses: Object.values(CAMPUS_REGISTRY),
    zones,
    setZones,
    selectedZone,
    setSelectedZone,
    selectZoneByCode,
    roads,
    setRoads,
    selectedRoad,
    setSelectedRoad,
    selectRoadById,
    activeMapLayer,
    setActiveMapLayer,
    activeModuleLayer,
    setActiveModuleLayer,
    searchQuery,
    setSearchQuery,
    activeAlert,
    setActiveAlert,
    isLiveApi: isZonesSuccess || isRoadsSuccess
  };

  return <CampusContext.Provider value={value}>{children}</CampusContext.Provider>;
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
}