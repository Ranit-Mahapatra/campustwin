import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, FlaskConical, Map } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export default function PriorityZonesRanking() {
  const navigate = useNavigate();
  const { zones, selectZoneByCode, setActiveMapLayer } = useCampus();
  const ranked = [...zones].sort((a, b) => b.vulnerability - a.vulnerability).slice(0, 6);

  const handleInspectMap = (code) => {
    selectZoneByCode(code);
    setActiveMapLayer('campus');
    navigate('/map');
  };

  const handleSimulate = (code) => {
    selectZoneByCode(code);
    navigate('/simulation');
  };

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Priority Intervention Zones</span>
        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Top 6 Ranked Vulnerability</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ranked.map((z, idx) => (
          <div
            key={z.code}
            style={{
              padding: '10px 12px',
              background: 'var(--panel2)',
              border: '1px solid #e0eaee',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#e2edf1', color: 'var(--cyan)', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 800 }}>
                  {idx + 1}
                </div>
                <b style={{ fontSize: '12px', color: 'var(--text)' }}>{z.code} — {z.name}</b>
              </div>
              <b style={{ fontSize: '12px', color: z.vulnerability >= 8 ? 'var(--red)' : '#f5b942' }}>
                {z.vulnerability}/10
              </b>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--muted)', paddingLeft: '30px' }}>
              {z.reason}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '30px', marginTop: '2px' }}>
              <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                Temp: <b>{z.temp}°C</b> · PM2.5: <b>{z.pm25}</b> · Canopy: <b>{z.treeCover}%</b>
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleInspectMap(z.code)}
                  style={{ fontSize: '9px', padding: '4px 6px' }}
                >
                  <Map size={10} /> Map
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleSimulate(z.code)}
                  style={{ fontSize: '9px', padding: '4px 6px' }}
                >
                  <FlaskConical size={10} /> Simulate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
