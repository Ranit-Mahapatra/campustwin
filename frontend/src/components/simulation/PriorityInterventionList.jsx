import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export default function PriorityInterventionList({ onSelectZone }) {
  const { zones, selectedZone } = useCampus();
  const ranked = [...zones].sort((a, b) => b.vulnerability - a.vulnerability).slice(0, 6);

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Priority Intervention Hotspots</span>
        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Top 6 Ranked</span>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '0 0 12px', lineHeight: 1.4 }}>
        Recommended areas for immediate greening, shade, or traffic dampening interventions based on composite thermal and particulate vulnerability scores.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ranked.map((z, idx) => {
          const isCurrent = selectedZone.code === z.code;
          return (
            <div
              key={z.code}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                background: isCurrent ? '#f0fdfa' : 'var(--panel2)',
                border: isCurrent ? '1.5px solid var(--cyan)' : '1px solid #e0eaee',
                borderRadius: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: isCurrent ? 'var(--cyan)' : '#e2edf1',
                  color: isCurrent ? '#ffffff' : 'var(--cyan)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '11px',
                  fontWeight: 800
                }}
              >
                {idx + 1}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <b style={{ fontSize: '12px', color: 'var(--text)' }}>{z.code} — {z.name}</b>
                  <b style={{ fontSize: '11px', color: z.vulnerability >= 8 ? 'var(--red)' : '#f5b942' }}>
                    {z.vulnerability}/10
                  </b>
                </div>
                <small style={{ fontSize: '10px', color: 'var(--muted)' }}>
                  {z.temp}°C · PM2.5: {z.pm25} · Canopy: {z.treeCover}%
                </small>
              </div>

              <button
                type="button"
                className={`btn-secondary ${isCurrent ? 'active' : ''}`}
                onClick={() => onSelectZone(z.code)}
                style={{ fontSize: '10px', padding: '5px 8px' }}
              >
                {isCurrent ? 'Selected' : 'Load Zone'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
