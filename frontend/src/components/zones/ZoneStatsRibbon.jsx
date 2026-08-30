import React from 'react';
import { useCampus } from '../../context/CampusContext';

export default function ZoneStatsRibbon() {
  const { zones } = useCampus();

  const totalZones = zones.length;
  const avgTemp = (zones.reduce((sum, z) => sum + z.temp, 0) / totalZones).toFixed(1);
  const maxPm = Math.max(...zones.map((z) => z.pm25));
  const avgTree = Math.round(zones.reduce((sum, z) => sum + z.treeCover, 0) / totalZones);
  const criticalCount = zones.filter((z) => z.vulnerability >= 8).length;
  const sensorCount = zones.filter((z) => z.confidence === 'sensor').length;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '10px',
        marginBottom: '14px'
      }}
    >
      <div className="panel-card" style={{ padding: '10px 12px' }}>
        <small style={{ fontSize: '9px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
          MONITORED UNITS
        </small>
        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--cyan)', marginTop: '2px' }}>
          {totalZones} <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>({sensorCount} live sensors)</span>
        </div>
      </div>

      <div className="panel-card" style={{ padding: '10px 12px' }}>
        <small style={{ fontSize: '9px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
          CAMPUS AVG TEMP
        </small>
        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', marginTop: '2px' }}>
          {avgTemp} <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>°C</span>
        </div>
      </div>

      <div className="panel-card" style={{ padding: '10px 12px' }}>
        <small style={{ fontSize: '9px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
          MAX PM2.5 POLLUTION
        </small>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
          {maxPm} <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>µg/m³</span>
        </div>
      </div>

      <div className="panel-card" style={{ padding: '10px 12px' }}>
        <small style={{ fontSize: '9px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
          CANOPY COVERAGE
        </small>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
          {avgTree} <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>%</span>
        </div>
      </div>

      <div className="panel-card" style={{ padding: '10px 12px' }}>
        <small style={{ fontSize: '9px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
          CRITICAL HOTSPOTS
        </small>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#ea580c', marginTop: '2px' }}>
          {criticalCount} <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>flagged</span>
        </div>
      </div>
    </div>
  );
}
