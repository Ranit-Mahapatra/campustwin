import React from 'react';
import { ArrowRight, TrendingDown, Sparkles } from 'lucide-react';

export default function BeforeAfterComparison({ baselineZone, result }) {
  if (!result) {
    return (
      <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '260px', textAlign: 'center', background: '#fbfdfe' }}>
        <Sparkles size={32} color="var(--cyan)" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '15px', margin: '0 0 6px', color: 'var(--text)' }}>
          Digital Twin Model Ready
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 14px', maxWidth: '340px', lineHeight: 1.5 }}>
          Select intervention parameters and click <b>RUN DIGITAL-TWIN SIMULATION</b> to compute before vs. after microclimate diffs.
        </p>
      </div>
    );
  }

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Before vs. After Comparison</span>
        <span className="badge-pill badge-low">{result.interventionLabel} ({result.intensity})</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
        {/* Baseline (Before) */}
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minWidth: 0 }}>
          <small style={{ fontSize: '9px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            BASELINE (CURRENT)
          </small>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', marginTop: '4px' }}>
            {baselineZone.temp}°C
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
            PM2.5: <b>{baselineZone.pm25}</b>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>
            Canopy: {baselineZone.treeCover}%
          </div>
        </div>

        {/* Simulated (After) */}
        <div style={{ background: '#f0fdfa', padding: '12px', borderRadius: '8px', border: '1px solid #99f6e4', minWidth: 0 }}>
          <small style={{ fontSize: '9px', fontWeight: 800, color: 'var(--cyan)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            SIMULATED (PROJECTED)
          </small>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--cyan)', marginTop: '4px' }}>
            {result.simTemp}°C
          </div>
          <div style={{ fontSize: '12px', color: 'var(--cyan)', marginTop: '2px' }}>
            PM2.5: <b>{result.simPm}</b>
          </div>
          <div style={{ fontSize: '10px', color: '#16a34a', marginTop: '4px', fontWeight: 700 }}>
            {result.interventionKey === 'trees' ? `Canopy: ~${baselineZone.treeCover + Math.round(result.intensityValue * 0.2)}%` : 'Active Cooling'}
          </div>
        </div>
      </div>

      <div className="telemetry-grid" style={{ marginBottom: '14px' }}>
        <div className="telemetry-read">
          <small>TEMP REDUCTION</small>
          <b style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <TrendingDown size={14} /> −{result.tempDrop}°C
          </b>
        </div>
        <div className="telemetry-read">
          <small>PM2.5 REDUCTION</small>
          <b style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <TrendingDown size={14} /> −{result.pmDrop} µg/m³
          </b>
        </div>
      </div>
    </div>
  );
}
