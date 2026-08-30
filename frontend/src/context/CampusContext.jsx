import React, { createContext, useContext, useState, useEffect } from 'react';
import { baselineZones } from '../data/baselineZones';
import { baselineRoads } from '../data/baselineRoads';
import { useZonesQuery, useRoadsQuery } from '../hooks/useCampusApi';

const CampusContext = createContext(null);

export function CampusProvider({ children }) {
  const { data: apiZones, isSuccess: isZonesSuccess } = useZonesQuery();
  const { data: apiRoads, isSuccess: isRoadsSuccess } = useRoadsQuery();

  const [zones, setZones] = useState(baselineZones);
  const [selectedZone, setSelectedZone] = useState(
    baselineZones.find((z) => z.code === 'Z-18') || baselineZones[0]
  );
  const [roads, setRoads] = useState(baselineRoads);
  const [selectedRoad, setSelectedRoad] = useState(baselineRoads[0]);
  const [activeMapLayer, setActiveMapLayer] = useState('campus'); // 'campus', 'roads', 'risk', 'routes'
  const [activeModuleLayer, setActiveModuleLayer] = useState('all'); // 'all', 'air', 'traffic', 'heat', 'green', 'emergency'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlert, setActiveAlert] = useState(null);

  // Sync zones with API data when successfully fetched
  useEffect(() => {
    if (isZonesSuccess && Array.isArray(apiZones) && apiZones.length > 0) {
      setZones(apiZones);
      setSelectedZone((prev) => apiZones.find((z) => z.code === prev?.code) || apiZones[0]);
    }
  }, [apiZones, isZonesSuccess]);

  // Sync roads with API data when successfully fetched
  useEffect(() => {
    if (isRoadsSuccess && Array.isArray(apiRoads) && apiRoads.length > 0) {
      setRoads(apiRoads);
      setSelectedRoad((prev) => apiRoads.find((r) => r.id === prev?.id) || apiRoads[0]);
    }
  }, [apiRoads, isRoadsSuccess]);

  const selectZoneByCode = (code) => {
    const found = zones.find((z) => z.code === code);
    if (found) {
      setSelectedZone(found);
    }
  };

  const selectRoadById = (id) => {
    const found = roads.find((r) => r.id === id);
    if (found) {
      setSelectedRoad(found);
    }
  };

  const value = {
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
