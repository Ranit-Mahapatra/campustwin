import React from 'react';
import { useCampus } from '../../context/CampusContext';

export default function SelectedZoneCard() {
  const { zones, selectedZone, selectZoneByCode } = useCampus();

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
    <div className="panel-card">
      <div className="panel-title">
        <span>Selected Zone</span>
        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{zones.length} areas</span>
      </div>

      <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.8px', marginBottom: '6px', fontWeight: 700 }}>
        CHANGE CAMPUS AREA
      </div>

      <select
        id="zone-select"
        value={selectedZone.code}
        onChange={(e) => selectZoneByCode(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #c8d9e0', fontSize: '12px', marginBottom: '14px' }}
      >
        {zones.map((z) => (
          <option key={z.code} value={z.code}>
            {z.code} — {z.name}
          </option>
        ))}
      </select>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <b style={{ fontSize: '14px', color: 'var(--text)' }}>{selectedZone.name}</b>
          <div style={{ color: '#718895', fontSize: '11px', marginTop: '2px' }}>
            {selectedZone.code} · {selectedZone.confidence === 'sensor' ? 'Live sensor' : 'Satellite estimate'}
          </div>
        </div>
        {getRiskBadge(selectedZone.aqi)}
      </div>

      <div className="telemetry-grid">
        <div className="telemetry-read">
          <small>TEMPERATURE</small>
          <b>{selectedZone.temp}°C</b>
        </div>
        <div className="telemetry-read">
          <small>PM2.5</small>
          <b>{selectedZone.pm25}</b>
        </div>
        <div className="telemetry-read">
          <small>TREE COVER</small>
          <b>{selectedZone.treeCover}%</b>
        </div>
        <div className="telemetry-read">
          <small>VULNERABILITY</small>
          <b style={{ color: selectedZone.vulnerability >= 8 ? 'var(--red)' : 'var(--text)' }}>
            {selectedZone.vulnerability}/10
          </b>
        </div>
      </div>
    </div>
  );
}
