import React from 'react';

export default function ImpactProgressBars({ result }) {
  if (!result) return null;

  return (
    <div className="panel-card" style={{ marginTop: '12px' }}>
      <div className="panel-title">
        <span>Mitigation Impact Index</span>
        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Relative Target Benchmarks</span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text)', marginBottom: '4px' }}>
          <span>Thermal Mitigation Effectiveness</span>
          <b style={{ color: 'var(--cyan)' }}>{result.tempImpactPercent}% of Max Potential</b>
        </div>
        <div style={{ height: '7px', background: '#dce8ed', borderRadius: '10px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${result.tempImpactPercent}%`,
              background: 'linear-gradient(90deg, #14b8a6, #087f76)',
              borderRadius: '10px',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text)', marginBottom: '4px' }}>
          <span>Particulate PM2.5 Clearance Rate</span>
          <b style={{ color: 'var(--blue)' }}>{result.pmImpactPercent}% of Max Potential</b>
        </div>
        <div style={{ height: '7px', background: '#dce8ed', borderRadius: '10px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${result.pmImpactPercent}%`,
              background: 'linear-gradient(90deg, #60a5fa, #2563eb)',
              borderRadius: '10px',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
