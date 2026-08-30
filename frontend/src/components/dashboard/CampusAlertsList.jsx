import React from 'react';
import { useCampus } from '../../context/CampusContext';

export default function CampusAlertsList() {
  const { selectZoneByCode, selectRoadById } = useCampus();

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Campus Alerts</span>
        <span style={{ fontSize: '9px', color: 'var(--muted)' }}>Today</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          onClick={() => selectZoneByCode('Z-11')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            background: '#fff5f5',
            cursor: 'pointer'
          }}
        >
          <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#fee2e2', color: '#dc2626', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '11px' }}>
            !
          </span>
          <div>
            <b style={{ display: 'block', fontSize: '11px', color: '#991b1b' }}>High heat detected</b>
            <small style={{ display: 'block', fontSize: '9px', color: '#7f1d1d' }}>Girls' Hostel · 40°C</small>
          </div>
        </div>

        <div
          onClick={() => selectZoneByCode('Z-02')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            border: '1px solid #fef08a',
            borderRadius: '8px',
            background: '#fffbeb',
            cursor: 'pointer'
          }}
        >
          <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#fef9c3', color: '#ca8a04', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '11px' }}>
            ●
          </span>
          <div>
            <b style={{ display: 'block', fontSize: '11px', color: '#854d0e' }}>Poor air quality</b>
            <small style={{ display: 'block', fontSize: '9px', color: '#713f12' }}>Parking Lot · PM2.5 114</small>
          </div>
        </div>

        <div
          onClick={() => selectRoadById('R-01')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            background: '#f0f9ff',
            cursor: 'pointer'
          }}
        >
          <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#e0f2fe', color: '#0284c7', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '11px' }}>
            ↗
          </span>
          <div>
            <b style={{ display: 'block', fontSize: '11px', color: '#075985' }}>Traffic congestion</b>
            <small style={{ display: 'block', fontSize: '9px', color: '#0c4a6e' }}>Main Gate Road · 86%</small>
          </div>
        </div>
      </div>
    </div>
  );
}
