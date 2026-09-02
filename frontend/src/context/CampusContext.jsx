import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

// Official National Air Quality Index (NAQI) dynamic calculator
export function calculateDynamicAqi(pm25) {
  if (pm25 <= 30) return { label: 'Good', color: '#10b981', level: 1 };
  if (pm25 <= 60) return { label: 'Satisfactory', color: '#34d399', level: 2 };
  if (pm25 <= 90) return { label: 'Moderate', color: '#f59e0b', level: 3 };
  if (pm25 <= 120) return { label: 'Poor', color: '#f97316', level: 4 };
  if (pm25 <= 250) return { label: 'Very Poor', color: '#ef4444', level: 5 };
  return { label: 'Severe', color: '#7f1d1d', level: 6 };
}

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
  
  // Real-time IoT Streaming and Spike Alert State
  const [isIotActive, setIsIotActive] = useState(true);
  const [lastSpikeEvent, setLastSpikeEvent] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);
  const prevReadingsRef = useRef({});

  const normalizeCampusKey = (val) => {
    if (!val) return 'soa_iter';
    const str = String(val).toLowerCase();
    if (str.includes('2')) return 'soa_campus_2';
    if (str.includes('city') || str.includes('smart')) return 'smart_city';
    return 'soa_iter';
  };

  const switchCampus = useCallback(async (newCampusRaw) => {
    const campusKey = normalizeCampusKey(newCampusRaw);
    setSelectedCampusState(campusKey);
    const config = CAMPUS_REGISTRY[campusKey] || CAMPUS_REGISTRY.soa_iter;
    setMapCenter(config.center);
    setMapZoom(config.zoom);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/zones/?campus=${campusKey}`);
      if (res.ok) {
        const data = await res.json();
        const zonesList = Array.isArray(data) ? data : data.results || [];
        if (zonesList.length > 0) {
          setZones(zonesList);
          setSelectedZone(zonesList[0]);
        }
      }
    } catch (err) {
      console.warn("Backend campus switch fallback:", err);
    }
  }, []);

  // Poll live IoT background telemetry from Django
  useEffect(() => {
    if (!isIotActive) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/zones/');
        if (res.ok) {
          const liveData = await res.json();
          const zonesList = Array.isArray(liveData) ? liveData : liveData.results || [];

          if (zonesList.length > 0) {
            // Check for sudden rate-of-change spikes (delta >= 15.0 µg/m³)
            zonesList.forEach((zone) => {
              const prev = prevReadingsRef.current[zone.code];
              if (prev !== undefined) {
                const delta = zone.pm25 - prev;
                if (delta >= 15) {
                  const spikeInfo = {
                    zoneCode: zone.code,
                    zoneName: zone.name,
                    delta: delta,
                    currentPm: zone.pm25,
                    timestamp: new Date().toLocaleTimeString(),
                  };
                  setLastSpikeEvent(spikeInfo);
                  setActiveAlert(`⚠️ CRITICAL SPIKE: ${zone.name} surged +${delta} µg/m³ PM2.5`);
                }
              }
              prevReadingsRef.current[zone.code] = zone.pm25;
            });

            setZones(zonesList);
            setSelectedZone((prev) => zonesList.find((z) => z.code === prev?.code) || zonesList[0]);
          }
        }
      } catch (e) {
        // Keeps running smoothly offline
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isIotActive]);

  // Trigger manual sudden AQI spike (for live demonstration)
  const triggerManualAqiSpike = (targetZoneCode, spikeDelta = 35) => {
    setZones((currZones) =>
      currZones.map((z) => {
        if (z.code === targetZoneCode || (!targetZoneCode && z.code === selectedZone?.code)) {
          const newPm = z.pm25 + spikeDelta;
          const newAqiObj = calculateDynamicAqi(newPm);
          const updated = {
            ...z,
            pm25: newPm,
            aqi: newAqiObj.label,
            reason: `ALERT: Sudden localized telemetry surge (+${spikeDelta} µg/m³) detected!`,
            isSpikeActive: true,
          };
          setLastSpikeEvent({
            zoneCode: updated.code,
            zoneName: updated.name,
            delta: spikeDelta,
            currentPm: newPm,
            timestamp: new Date().toLocaleTimeString(),
          });
          setActiveAlert(`⚠️ SUDDEN SURGE: ${updated.name} surged +${spikeDelta} µg/m³!`);
          setSelectedZone(updated);
          return updated;
        }
        return z;
      })
    );
  };

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
    setSelectedCampus: switchCampus,
    switchCampus,
    mapCenter,
    mapZoom,
    zones,
    setZones,
    selectedZone,
    setSelectedZone,
    selectZoneByCode,
    roads,
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
    isIotActive,
    setIsIotActive,
    lastSpikeEvent,
    triggerManualAqiSpike,
    isLiveApi: isZonesSuccess || isRoadsSuccess,
  };

  return <CampusContext.Provider value={value}>{children}</CampusContext.Provider>;
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) throw new Error('useCampus must be used within a CampusProvider');
  return context;
}