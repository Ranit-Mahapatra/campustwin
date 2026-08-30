import React from 'react';
import { useCampus } from '../../context/CampusContext';

export default function PriorityZonesCard() {
  const { zones, selectZoneByCode } = useCampus();
  const ranked = [...zones].sort((a, b) => b.vulnerability - a.vulnerability).slice(0, 6);

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Priority Intervention Zones</span>
        <span style={{ fontSize: '9px', color: 'var(--muted)' }}>Top 6 Ranked</span>
      </div>

      <div id="priority" style={{ display: 'flex', flexDirection: 'column' }}>
        {ranked.map((z, idx) => (
          <div
            key={z.code}
            onClick={() => selectZoneByCode(z.code)}
            style={{
              display: 'flex',
              gap: '9px',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: idx === ranked.length - 1 ? 'none' : '1px solid #e0eaee',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                background: '#e6eef1',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--cyan)',
                fontSize: '10px',
                fontWeight: 800
              }}
            >
              {idx + 1}
            </div>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: '11px', color: 'var(--text)' }}>
                {z.code} — {z.name}
              </b>
              <small style={{ display: 'block', color: 'var(--muted)', fontSize: '9px', marginTop: '2px' }}>
                {z.reason}
              </small>
            </div>
            <b style={{ fontSize: '11px', color: z.vulnerability >= 8 ? 'var(--red)' : '#f5b942' }}>
              {z.vulnerability}/10
            </b>
          </div>
        ))}
      </div>
    </div>
  );
}
