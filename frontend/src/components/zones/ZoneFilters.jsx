import React from 'react';
import { Filter, Layers, ShieldAlert, Wind, Activity } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export default function ZoneFilters({ filterType, setFilterType }) {
  const { zones } = useCampus();

  const counts = {
    all: zones.length,
    critical: zones.filter((z) => z.vulnerability >= 8).length,
    Good: zones.filter((z) => z.aqi === 'Good').length,
    Moderate: zones.filter((z) => z.aqi === 'Moderate').length,
    Severe: zones.filter((z) => z.aqi === 'Severe').length,
    sensor: zones.filter((z) => z.confidence === 'sensor').length,
    estimate: zones.filter((z) => z.confidence === 'estimate').length
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '10px 14px',
        background: '#ffffff',
        border: '1px solid #d0dfe5',
        borderRadius: '10px',
        boxShadow: '0 4px 14px rgba(35, 72, 86, 0.04)'
      }}
    >
      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
        <Filter size={12} /> Filter Zones:
      </span>

      <button
        type="button"
        className={`btn-secondary ${filterType === 'all' ? 'active' : ''}`}
        onClick={() => setFilterType('all')}
        style={{ fontSize: '11px', padding: '5px 10px' }}
      >
        All ({counts.all})
      </button>

      <button
        type="button"
        className={`btn-secondary ${filterType === 'critical' ? 'active' : ''}`}
        onClick={() => setFilterType('critical')}
        style={{ fontSize: '11px', padding: '5px 10px' }}
      >
        <ShieldAlert size={12} color="#dc2626" /> Critical ({counts.critical})
      </button>

      <button
        type="button"
        className={`btn-secondary ${filterType === 'Good' ? 'active' : ''}`}
        onClick={() => setFilterType('Good')}
        style={{ fontSize: '11px', padding: '5px 10px' }}
      >
        <Wind size={12} color="#16a34a" /> Good AQI ({counts.Good})
      </button>

      <button
        type="button"
        className={`btn-secondary ${filterType === 'Moderate' ? 'active' : ''}`}
        onClick={() => setFilterType('Moderate')}
        style={{ fontSize: '11px', padding: '5px 10px' }}
      >
        Moderate ({counts.Moderate})
      </button>

      <button
        type="button"
        className={`btn-secondary ${filterType === 'Severe' ? 'active' : ''}`}
        onClick={() => setFilterType('Severe')}
        style={{ fontSize: '11px', padding: '5px 10px' }}
      >
        Severe ({counts.Severe})
      </button>

      <button
        type="button"
        className={`btn-secondary ${filterType === 'sensor' ? 'active' : ''}`}
        onClick={() => setFilterType('sensor')}
        style={{ fontSize: '11px', padding: '5px 10px' }}
      >
        <Activity size={12} color="var(--cyan)" /> Live Sensors ({counts.sensor})
      </button>

      <button
        type="button"
        className={`btn-secondary ${filterType === 'estimate' ? 'active' : ''}`}
        onClick={() => setFilterType('estimate')}
        style={{ fontSize: '11px', padding: '5px 10px' }}
      >
        Satellite Model ({counts.estimate})
      </button>
    </div>
  );
}
