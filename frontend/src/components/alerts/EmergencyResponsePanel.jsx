import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Navigation, AlertCircle } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export default function EmergencyResponsePanel() {
  const navigate = useNavigate();
  const { setActiveMapLayer } = useCampus();
  const [emergencyType, setEmergencyType] = useState('Medical emergency');

  const handleActivateEmergency = () => {
    setActiveMapLayer('routes');
    navigate('/map');
  };

  return (
    <div className="panel-card" style={{ border: '1.5px solid #fecaca', background: '#fffcfc' }}>
      <div className="panel-title">
        <span style={{ color: '#b91c1c' }}>Emergency Response Protocol</span>
        <ShieldAlert size={15} color="#dc2626" />
      </div>

      <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '0 0 12px', lineHeight: 1.4 }}>
        Select incident profile to dynamically compute and overlay the safest evacuation corridor bypassing congested and hazardous transit segments.
      </p>

      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.6px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
          Select Emergency Scenario
        </label>
        <select
          id="emergency-scenario-select"
          value={emergencyType}
          onChange={(e) => setEmergencyType(e.target.value)}
          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbdbe1', fontSize: '12px' }}
        >
          <option>Medical emergency</option>
          <option>Road blockage</option>
          <option>Fire response</option>
          <option>Flood response</option>
        </select>
      </div>

      <button
        type="button"
        className="btn-primary"
        onClick={handleActivateEmergency}
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '11px',
          background: '#fee2e2',
          color: '#dc2626',
          borderColor: '#fca5a5',
          fontSize: '12px',
          fontWeight: 800
        }}
      >
        <Navigation size={15} /> SHOW SAFEST EVACUATION CORRIDOR
      </button>
    </div>
  );
}
