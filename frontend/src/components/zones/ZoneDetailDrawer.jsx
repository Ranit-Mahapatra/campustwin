import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Map, AlertTriangle, CheckCircle, Trees, ShieldAlert, X } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export default function ZoneDetailDrawer({ zone, onClose }) {
  const navigate = useNavigate();
  const { setActiveMapLayer, setSelectedZone } = useCampus();

  if (!zone) return null;

  const handleInspectMap = () => {
    setSelectedZone(zone);
    setActiveMapLayer('campus');
    navigate('/map');
  };

  const handleRunSim = () => {
    setSelectedZone(zone);
    navigate('/simulation');
  };

  return (
    <div className="panel-card" style={{ border: '2px solid var(--cyan)', background: '#fbfefe' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--cyan)', letterSpacing: '0.8px' }}>
            DEEP-DIVE INSPECTION · {zone.code}
          </span>
          <h2 style={{ fontSize: '18px', margin: '4px 0 0', color: 'var(--text)' }}>
            {zone.name}
          </h2>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
            GPS: [{zone.lat}, {zone.lng}] · Data source: <b>{zone.confidence === 'sensor' ? 'Live IoT Sensor' : 'Satellite / Model Estimate'}</b>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div style={{ background: '#f1f8f9', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d4e7eb', marginBottom: '14px', fontSize: '12px', color: '#274b57', lineHeight: 1.5 }}>
        <b>Environmental Profile:</b> {zone.reason}
      </div>

      <div className="telemetry-grid" style={{ marginBottom: '16px' }}>
        <div className="telemetry-read">
          <small>CURRENT TEMP</small>
          <b style={{ color: zone.temp >= 38 ? 'var(--red)' : 'var(--text)' }}>{zone.temp}°C</b>
        </div>
        <div className="telemetry-read">
          <small>PM2.5 AIR QUALITY</small>
          <b style={{ color: zone.pm25 >= 100 ? 'var(--red)' : zone.pm25 >= 60 ? '#f5b942' : 'var(--green)' }}>
            {zone.pm25} µg/m³
          </b>
        </div>
        <div className="telemetry-read">
          <small>TREE CANOPY COVER</small>
          <b style={{ color: zone.treeCover <= 15 ? 'var(--red)' : '#16a34a' }}>
            {zone.treeCover}%
          </b>
        </div>
        <div className="telemetry-read">
          <small>VULNERABILITY INDEX</small>
          <b style={{ color: zone.vulnerability >= 8 ? 'var(--red)' : 'var(--text)' }}>
            {zone.vulnerability}/10
          </b>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={handleInspectMap}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <Map size={14} /> Open in GIS Map Studio
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleRunSim}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <FlaskConical size={14} /> Launch What-If Simulation
        </button>
      </div>
    </div>
  );
}
