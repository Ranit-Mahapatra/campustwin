import React from 'react';
import { Layers, Route, ShieldAlert, Car, Wind, Flame, Trees, Eye } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export default function MapToolbar() {
  const {
    activeMapLayer,
    setActiveMapLayer,
    activeModuleLayer,
    setActiveModuleLayer
  } = useCampus();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #d0dfe5',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 6px 18px rgba(35, 72, 86, 0.08)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginRight: '4px' }}>
            GIS Layer Mode:
          </span>
          <button
            type="button"
            className={`btn-secondary ${activeMapLayer === 'campus' ? 'active' : ''}`}
            onClick={() => setActiveMapLayer('campus')}
            style={{ fontSize: '11px', padding: '6px 10px' }}
          >
            <Layers size={13} /> Campus Zones
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeMapLayer === 'roads' ? 'active' : ''}`}
            onClick={() => setActiveMapLayer('roads')}
            style={{ fontSize: '11px', padding: '6px 10px' }}
          >
            <Car size={13} /> Streets & Corridors
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeMapLayer === 'risk' ? 'active' : ''}`}
            onClick={() => setActiveMapLayer('risk')}
            style={{ fontSize: '11px', padding: '6px 10px' }}
          >
            <ShieldAlert size={13} /> Risk Heatmap
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeMapLayer === 'routes' ? 'active' : ''}`}
            onClick={() => setActiveMapLayer('routes')}
            style={{ fontSize: '11px', padding: '6px 10px' }}
          >
            <Route size={13} /> Emergency Routes
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginRight: '4px' }}>
            Focus Module:
          </span>
          <button
            type="button"
            className={`btn-secondary ${activeModuleLayer === 'all' ? 'active' : ''}`}
            onClick={() => setActiveModuleLayer('all')}
            style={{ fontSize: '10px', padding: '5px 8px' }}
          >
            <Eye size={12} /> All
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeModuleLayer === 'air' ? 'active' : ''}`}
            onClick={() => setActiveModuleLayer('air')}
            style={{ fontSize: '10px', padding: '5px 8px' }}
          >
            <Wind size={12} /> Air
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeModuleLayer === 'heat' ? 'active' : ''}`}
            onClick={() => setActiveModuleLayer('heat')}
            style={{ fontSize: '10px', padding: '5px 8px' }}
          >
            <Flame size={12} /> Heat
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeModuleLayer === 'traffic' ? 'active' : ''}`}
            onClick={() => setActiveModuleLayer('traffic')}
            style={{ fontSize: '10px', padding: '5px 8px' }}
          >
            <Car size={12} /> Traffic
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeModuleLayer === 'green' ? 'active' : ''}`}
            onClick={() => setActiveModuleLayer('green')}
            style={{ fontSize: '10px', padding: '5px 8px' }}
          >
            <Trees size={12} /> Green
          </button>
        </div>
      </div>
    </div>
  );
}
