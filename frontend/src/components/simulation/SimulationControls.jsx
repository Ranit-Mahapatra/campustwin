import React from 'react';
import { Play, FlaskConical } from 'lucide-react';
import { INTERVENTION_FACTORS } from '../../data/simulationFactors';

export default function SimulationControls({
  zones,
  selectedZone,
  onSelectZone,
  intervention,
  onSelectIntervention,
  intensity,
  onIntensityChange,
  onRunSimulation
}) {
  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Intervention Configuration</span>
        <FlaskConical size={14} color="var(--cyan)" />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '6px', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
          Target Campus Area
        </label>
        <select
          id="sim-zone-select"
          value={selectedZone.code}
          onChange={(e) => onSelectZone(e.target.value)}
          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbdbe1', fontSize: '12px' }}
        >
          {zones.map((z) => (
            <option key={z.code} value={z.code}>
              {z.code} — {z.name} (Temp: {z.temp}°C, PM2.5: {z.pm25}, Canopy: {z.treeCover}%)
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '6px', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
          Intervention Type
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {Object.entries(INTERVENTION_FACTORS).map(([key, factor]) => {
            const isActive = intervention === key;
            return (
              <button
                key={key}
                type="button"
                className={`btn-secondary ${isActive ? 'active' : ''}`}
                onClick={() => onSelectIntervention(key)}
                style={{
                  justifyContent: 'flex-start',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '16px' }}>{factor.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <b style={{ display: 'block', fontSize: '11px' }}>{factor.label}</b>
                  <small style={{ fontSize: '9px', color: 'var(--muted)' }}>
                    -{factor.tempFactor}°C / -{factor.pmFactor} PM
                  </small>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            Implementation Intensity
          </label>
          <b style={{ color: 'var(--cyan)', fontSize: '13px' }}>{intensity}%</b>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={intensity}
          onChange={(e) => onIntensityChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--cyan)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--muted)', marginTop: '4px' }}>
          <span>10% (Low Effort)</span>
          <span>50% (Standard)</span>
          <span>100% (Full Deployment)</span>
        </div>
      </div>

      <button
        type="button"
        className="btn-primary"
        onClick={onRunSimulation}
        style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '12px', fontWeight: 800 }}
      >
        <Play size={14} /> RUN DIGITAL-TWIN SIMULATION
      </button>
    </div>
  );
}
