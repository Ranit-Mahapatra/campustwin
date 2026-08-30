import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Navigation, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export default function MapZoneDrawer() {
  const {
    zones,
    selectedZone,
    selectZoneByCode,
    roads,
    selectedRoad,
    selectRoadById,
    setActiveMapLayer
  } = useCampus();

  const getRiskBadge = (aqi) => {
    switch (aqi) {
      case 'Severe':
        return <span className="badge-pill badge-high">Severe</span>;
      case 'Moderate':
        return <span className="badge-pill badge-mod">Moderate</span>;
      default:
        return <span className="badge-pill badge-low">Good</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Zone Inspector Card */}
      <div className="panel-card">
        <div className="panel-title">
          <span>Campus Zone Inspector</span>
          {getRiskBadge(selectedZone.aqi)}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '9px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
            INSPECTED CAMPUS AREA
          </label>
          <select
            value={selectedZone.code}
            onChange={(e) => selectZoneByCode(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbdbe1', fontSize: '12px' }}
          >
            {zones.map((z) => (
              <option key={z.code} value={z.code}>
                {z.code} — {z.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)' }}>
            {selectedZone.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
            {selectedZone.reason}
          </div>
        </div>

        <div className="telemetry-grid" style={{ marginBottom: '12px' }}>
          <div className="telemetry-read">
            <small>TEMPERATURE</small>
            <b>{selectedZone.temp}°C</b>
          </div>
          <div className="telemetry-read">
            <small>PM2.5 AIR</small>
            <b>{selectedZone.pm25}</b>
          </div>
          <div className="telemetry-read">
            <small>CANOPY COVER</small>
            <b>{selectedZone.treeCover}%</b>
          </div>
          <div className="telemetry-read">
            <small>VULNERABILITY</small>
            <b style={{ color: selectedZone.vulnerability >= 8 ? 'var(--red)' : 'var(--text)' }}>
              {selectedZone.vulnerability}/10
            </b>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/simulation" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <FlaskConical size={13} /> Simulate Zone
          </Link>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setActiveMapLayer('routes')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Navigation size={13} /> Evac Route
          </button>
        </div>
      </div>

      {/* Transit Corridor Inspector Card */}
      <div className="panel-card">
        <div className="panel-title">
          <span>Corridor Intelligence</span>
          <span className="badge-pill badge-mod">{selectedRoad.risk}</span>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '9px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
            TRANSIT CORRIDOR
          </label>
          <select
            value={selectedRoad.id}
            onChange={(e) => selectRoadById(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbdbe1', fontSize: '12px' }}
          >
            {roads.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} — {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="telemetry-grid">
          <div className="telemetry-read">
            <small>TRAFFIC LOAD</small>
            <b>{selectedRoad.traffic}%</b>
          </div>
          <div className="telemetry-read">
            <small>AVG SPEED</small>
            <b>{selectedRoad.speed} km/h</b>
          </div>
          <div className="telemetry-read">
            <small>NOISE LEVEL</small>
            <b>{selectedRoad.noise} dB</b>
          </div>
          <div className="telemetry-read">
            <small>CORRIDOR RISK</small>
            <b>{selectedRoad.risk}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
