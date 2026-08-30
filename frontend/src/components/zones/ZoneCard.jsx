import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, FlaskConical, Map, CheckCircle2 } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export default function ZoneCard({ zone, isSelected }) {
  const navigate = useNavigate();
  const { setSelectedZone, setActiveMapLayer } = useCampus();

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

  const handleInspectOnMap = (e) => {
    e.stopPropagation();
    setSelectedZone(zone);
    setActiveMapLayer('campus');
    navigate('/map');
  };

  const handleSimulate = (e) => {
    e.stopPropagation();
    setSelectedZone(zone);
    navigate('/simulation');
  };

  return (
    <div
      className="panel-card"
      onClick={() => setSelectedZone(zone)}
      style={{
        cursor: 'pointer',
        borderColor: isSelected ? 'var(--cyan)' : 'var(--line)',
        boxShadow: isSelected ? '0 0 0 2px var(--cyan), 0 8px 24px rgba(8,127,118,0.12)' : '0 4px 14px rgba(35, 72, 86, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        background: isSelected ? '#f8fdfc' : '#ffffff'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--cyan)', letterSpacing: '0.8px' }}>
                {zone.code}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <MapPin size={10} /> {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
              </span>
            </div>
            <h3 style={{ fontSize: '14px', margin: '4px 0 0', color: 'var(--text)', fontWeight: 700 }}>
              {zone.name}
            </h3>
          </div>
          {getRiskBadge(zone.aqi)}
        </div>

        <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '0 0 12px', lineHeight: 1.4, minHeight: '32px' }}>
          {zone.reason}
        </p>

        <div className="telemetry-grid" style={{ marginBottom: '12px' }}>
          <div className="telemetry-read">
            <small>TEMP</small>
            <b>{zone.temp}°C</b>
          </div>
          <div className="telemetry-read">
            <small>PM2.5</small>
            <b>{zone.pm25}</b>
          </div>
          <div className="telemetry-read">
            <small>CANOPY</small>
            <b>{zone.treeCover}%</b>
          </div>
          <div className="telemetry-read">
            <small>VULNERABILITY</small>
            <b style={{ color: zone.vulnerability >= 8 ? 'var(--red)' : 'var(--text)' }}>
              {zone.vulnerability}/10
            </b>
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--line)', marginBottom: '10px', fontSize: '10px', color: 'var(--muted)' }}>
          <span>Source: <b>{zone.confidence === 'sensor' ? '● Live Sensor' : '◌ Model Estimate'}</b></span>
          {isSelected && (
            <span style={{ color: 'var(--cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <CheckCircle2 size={12} /> Active Zone
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleInspectOnMap}
            style={{ flex: 1, justifyContent: 'center', fontSize: '10px', padding: '6px 8px' }}
          >
            <Map size={12} /> Map View
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleSimulate}
            style={{ flex: 1, justifyContent: 'center', fontSize: '10px', padding: '6px 8px' }}
          >
            <FlaskConical size={12} /> Simulate
          </button>
        </div>
      </div>
    </div>
  );
}
