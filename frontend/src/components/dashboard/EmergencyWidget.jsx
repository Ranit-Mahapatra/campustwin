import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampus } from '../../context/CampusContext';

export default function EmergencyWidget() {
  const navigate = useNavigate();
  const { setActiveMapLayer } = useCampus();
  const [emergencyType, setEmergencyType] = useState('Medical emergency');

  const handleShowRoute = () => {
    setActiveMapLayer('routes');
    navigate('/map');
  };

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Emergency Mode</span>
      </div>

      <select
        id="emergency-type"
        value={emergencyType}
        onChange={(e) => setEmergencyType(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #c8d9e0', fontSize: '11px', marginBottom: '8px' }}
      >
        <option>Medical emergency</option>
        <option>Road blockage</option>
        <option>Fire response</option>
        <option>Flood response</option>
      </select>

      <button
        type="button"
        id="emergency-btn"
        className="btn-primary"
        onClick={handleShowRoute}
        style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: '11px' }}
      >
        SHOW SAFEST ROUTE
      </button>
    </div>
  );
}
