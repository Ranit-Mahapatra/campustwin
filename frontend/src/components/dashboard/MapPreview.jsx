import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useCampus } from '../../context/CampusContext';
import { roadCoordinates } from '../../data/baselineRoads';

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

export default function MapPreview() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const { zones, selectedZone, setSelectedZone, roads, selectedRoad, setSelectedRoad } = useCampus();

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

      // Zones layer
      const zoneLayer = L.layerGroup().addTo(map);
      const riskLayer = L.layerGroup().addTo(map);

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
          <div style="font-family: Inter, sans-serif; min-width: 170px; font-size: 11px;">
            <h3 style="margin: 0 0 6px; font-size: 13px; color: #1e3945;">${z.name}</h3>
            <p style="margin: 3px 0;"><b>Zone:</b> ${z.code}</p>
            <p style="margin: 3px 0;"><b>Temp:</b> ${z.temp}°C</p>
            <p style="margin: 3px 0;"><b>PM2.5:</b> ${z.pm25}</p>
            <p style="margin: 3px 0;"><b>Canopy:</b> ${z.treeCover}%</p>
            <p style="margin: 3px 0;"><b>Vulnerability:</b> ${z.vulnerability}/10</p>
            <p style="margin: 3px 0; color: #64748b;"><b>Source:</b> ${z.confidence === 'sensor' ? 'Live sensor' : 'Satellite / model estimate'}</p>
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

      // Roads layer
      const roadLayer = L.layerGroup().addTo(map);
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
            <div style="font-family: Inter, sans-serif; font-size: 11px;">
              <h3 style="margin: 0 0 6px; font-size: 13px;">${r.name}</h3>
              <p style="margin: 3px 0;">Traffic: <b>${r.traffic}%</b></p>
              <p style="margin: 3px 0;">Speed: <b>${r.speed} km/h</b></p>
              <p style="margin: 3px 0;">Noise: <b>${r.noise} dB</b></p>
              <p style="margin: 3px 0;">Risk: <b>${r.risk}</b></p>
            </div>
          `);

          line.on('click', () => {
            setSelectedRoad(r);
          });

          line.addTo(roadLayer);
        }
      });
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

  // Pan to selected zone when changed
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
    <div className="panel-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '400px',
          background: '#e8f0f3'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 500,
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid #cbdbe1',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--cyan)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
        }}
      >
        GIS Campus Digital Twin · 20 Zones Active
      </div>
    </div>
  );
}
