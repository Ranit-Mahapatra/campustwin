import React from 'react';
import { useCampus } from '../../context/CampusContext';

export default function StreetIntelligenceCard() {
  const { roads, selectedRoad, selectRoadById } = useCampus();

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Street Intelligence</span>
        <span className="badge-pill badge-mod">{selectedRoad.risk}</span>
      </div>

      <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.8px', marginBottom: '6px', fontWeight: 700 }}>
        SELECT TRANSIT CORRIDOR
      </div>

      <select
        id="road-select"
        value={selectedRoad.id}
        onChange={(e) => selectRoadById(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #c8d9e0', fontSize: '12px', marginBottom: '14px' }}
      >
        {roads.map((r) => (
          <option key={r.id} value={r.id}>
            {r.id} — {r.name}
          </option>
        ))}
      </select>

      <div className="telemetry-grid">
        <div className="telemetry-read">
          <small>TRAFFIC</small>
          <b>{selectedRoad.traffic}%</b>
        </div>
        <div className="telemetry-read">
          <small>AVG SPEED</small>
          <b>{selectedRoad.speed} km/h</b>
        </div>
        <div className="telemetry-read">
          <small>NOISE</small>
          <b>{selectedRoad.noise} dB</b>
        </div>
        <div className="telemetry-read">
          <small>RISK</small>
          <b>{selectedRoad.risk}</b>
        </div>
      </div>
    </div>
  );
}
