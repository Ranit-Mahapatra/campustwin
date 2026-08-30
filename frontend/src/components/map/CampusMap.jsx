import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useCampus } from '../../context/CampusContext';
import { roadCoordinates, emergencyEvacuationRoute } from '../../data/baselineRoads';

function aqiColor(a) {
  switch (a) {
    case 'Good':
      return '#4ade80';
    case 'Moderate':
      return '#f5b942';
    case 'Poor':
      return '#fb923c';
    case 'Severe':
      return '#ef4444';
    default:
      return '#8b93a7';
  }
}

export default function CampusMap({ height = '620px' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const zoneLayerRef = useRef(null);
  const roadLayerRef = useRef(null);
  const riskLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markersRef = useRef({});

  const {
    zones,
    selectedZone,
    setSelectedZone,
    roads,
    selectedRoad,
    setSelectedRoad,
    activeMapLayer,
    activeModuleLayer,
    searchQuery
  } = useCampus();

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20.2493289, 85.8011446],
        zoom: 17,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;

      // Initialize layer groups
      const zoneLayer = L.layerGroup().addTo(map);
      const roadLayer = L.layerGroup().addTo(map);
      const riskLayer = L.layerGroup();
      const routeLayer = L.layerGroup();

      zoneLayerRef.current = zoneLayer;
      roadLayerRef.current = roadLayer;
      riskLayerRef.current = riskLayer;
      routeLayerRef.current = routeLayer;

      // Populate Zones
      zones.forEach((z) => {
        const mk = L.circleMarker([z.lat, z.lng], {
          radius: 10,
          fillColor: aqiColor(z.aqi),
          color: z.confidence === 'sensor' ? '#ffffff' : aqiColor(z.aqi),
          weight: z.confidence === 'sensor' ? 2 : 1.5,
          dashArray: z.confidence === 'estimate' ? '3,3' : null,
          fillOpacity: 0.9
        });

        mk.bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 180px; font-size: 11px; color: #1e3945;">
            <h3 style="margin: 0 0 6px; font-size: 13px; color: #087f76;">${z.name}</h3>
            <p style="margin: 3px 0;"><b>Zone Code:</b> ${z.code}</p>
            <p style="margin: 3px 0;"><b>Temperature:</b> ${z.temp}°C</p>
            <p style="margin: 3px 0;"><b>PM2.5 Level:</b> ${z.pm25}</p>
            <p style="margin: 3px 0;"><b>Canopy Cover:</b> ${z.treeCover}%</p>
            <p style="margin: 3px 0;"><b>Vulnerability:</b> ${z.vulnerability}/10</p>
            <p style="margin: 3px 0; color: #64748b;"><b>Data Source:</b> ${z.confidence === 'sensor' ? 'Live IoT Sensor' : 'Satellite / Model Estimate'}</p>
          </div>
        `);

        mk.on('click', () => {
          setSelectedZone(z);
        });

        mk.addTo(zoneLayer);
        markersRef.current[z.code] = mk;

        if (z.vulnerability >= 8) {
          L.circle([z.lat, z.lng], {
            radius: 45,
            color: '#ef4444',
            weight: 1,
            fillOpacity: 0.08
          }).addTo(riskLayer);
        }
      });

      // Populate Road Segments
      roads.forEach((r) => {
        const col = r.risk === 'HIGH' ? '#ef4444' : r.risk === 'MODERATE' ? '#f5b942' : '#4ade80';
        const coords = roadCoordinates[r.id];
        if (coords) {
          const line = L.polyline(coords, {
            color: col,
            weight: 7,
            opacity: 0.8
          });

          line.bindPopup(`
            <div style="font-family: Inter, sans-serif; font-size: 11px; color: #1e3945;">
              <h3 style="margin: 0 0 6px; font-size: 13px; color: #087f76;">${r.name}</h3>
              <p style="margin: 3px 0;">Corridor: <b>${r.from} → ${r.to}</b></p>
              <p style="margin: 3px 0;">Traffic Intensity: <b>${r.traffic}%</b></p>
              <p style="margin: 3px 0;">Transit Speed: <b>${r.speed} km/h</b></p>
              <p style="margin: 3px 0;">Noise Level: <b>${r.noise} dB</b></p>
              <p style="margin: 3px 0;">Corridor Risk: <b>${r.risk}</b></p>
            </div>
          `);

          line.on('click', () => {
            setSelectedRoad(r);
          });

          line.addTo(roadLayer);
        }
      });

      // Populate Emergency Evacuation Route
      L.polyline(emergencyEvacuationRoute.path, {
        color: '#5de2d0',
        weight: 9,
        opacity: 0.9
      }).addTo(routeLayer);

      L.circleMarker([emergencyEvacuationRoute.incident.lat, emergencyEvacuationRoute.incident.lng], {
        radius: 7,
        color: '#ffffff',
        fillColor: '#ef4444',
        fillOpacity: 1
      })
        .bindTooltip('INCIDENT ORIGIN', { permanent: true, direction: 'top' })
        .addTo(routeLayer);

      L.circleMarker([emergencyEvacuationRoute.safeDestination.lat, emergencyEvacuationRoute.safeDestination.lng], {
        radius: 7,
        color: '#ffffff',
        fillColor: '#4ade80',
        fillOpacity: 1
      })
        .bindTooltip('SAFE DESTINATION', { permanent: true, direction: 'top' })
        .addTo(routeLayer);
    }

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [zones, roads, setSelectedZone, setSelectedRoad]);

  // 2. Manage Layer Visibility based on activeMapLayer and activeModuleLayer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const zoneLayer = zoneLayerRef.current;
    const roadLayer = roadLayerRef.current;
    const riskLayer = riskLayerRef.current;
    const routeLayer = routeLayerRef.current;

    // Reset base layers
    if (activeMapLayer === 'campus') {
      zoneLayer?.addTo(map);
      roadLayer?.addTo(map);
      riskLayer?.removeFrom(map);
      routeLayer?.removeFrom(map);
    } else if (activeMapLayer === 'roads') {
      zoneLayer?.removeFrom(map);
      roadLayer?.addTo(map);
      riskLayer?.removeFrom(map);
      routeLayer?.removeFrom(map);
    } else if (activeMapLayer === 'risk') {
      zoneLayer?.addTo(map);
      roadLayer?.addTo(map);
      riskLayer?.addTo(map);
      routeLayer?.removeFrom(map);
    } else if (activeMapLayer === 'routes') {
      zoneLayer?.addTo(map);
      roadLayer?.addTo(map);
      riskLayer?.removeFrom(map);
      routeLayer?.addTo(map);
    }

    // Handle module overlay filtering
    if (activeModuleLayer === 'air' || activeModuleLayer === 'heat' || activeModuleLayer === 'green') {
      zoneLayer?.addTo(map);
      roadLayer?.removeFrom(map);
    } else if (activeModuleLayer === 'traffic') {
      roadLayer?.addTo(map);
      zoneLayer?.removeFrom(map);
    } else if (activeModuleLayer === 'emergency') {
      roadLayer?.addTo(map);
      routeLayer?.addTo(map);
      zoneLayer?.removeFrom(map);
    }
  }, [activeMapLayer, activeModuleLayer]);

  // 3. Search Query Marker Opacity Filtering
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    zones.forEach((z) => {
      const marker = markersRef.current[z.code];
      if (marker && marker._path) {
        const matches = !q || z.name.toLowerCase().includes(q) || z.code.toLowerCase().includes(q);
        marker._path.style.opacity = matches ? '1' : '0.18';
      }
    });
  }, [searchQuery, zones]);

  // 4. Pan / Focus on Selected Zone
  useEffect(() => {
    if (mapInstanceRef.current && selectedZone) {
      mapInstanceRef.current.setView([selectedZone.lat, selectedZone.lng], 18);
      const mk = markersRef.current[selectedZone.code];
      if (mk) {
        mk.openPopup();
      }
    }
  }, [selectedZone]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height,
        background: '#e8f0f3',
        borderRadius: '10px'
      }}
    />
  );
}
