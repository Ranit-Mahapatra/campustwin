import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { INTERVENTION_FACTORS, calculateSimulation } from '../../data/simulationFactors';

export default function SimulationWidget() {
  const { zones, selectedZone, selectZoneByCode } = useCampus();
  const [intervention, setIntervention] = useState('trees');
  const [intensity, setIntensity] = useState(50);
  const [result, setResult] = useState(null);

  const handleRunSim = () => {
    const res = calculateSimulation({
      baseTemp: selectedZone.temp,
      basePm: selectedZone.pm25,
      intervention,
      intensityPercent: intensity
    });
    setResult(res);
  };

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>What-if Simulation</span>
      </div>

      <select
        id="sim-zone"
        value={selectedZone.code}
        onChange={(e) => {
          selectZoneByCode(e.target.value);
          setResult(null);
        }}
        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #c8d9e0', fontSize: '11px', marginBottom: '8px' }}
      >
        {zones.map((z) => (
          <option key={z.code} value={z.code}>
            {z.code} — {z.name}
          </option>
        ))}
      </select>

      <div style={{ fontSize: '9px', color: '#718895', margin: '4px 0 6px', fontWeight: 700 }}>
        INTERVENTION
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '8px' }}>
        <button
          type="button"
          className={`btn-secondary ${intervention === 'trees' ? 'active' : ''}`}
          onClick={() => setIntervention('trees')}
          style={{ fontSize: '10px', padding: '6px 8px' }}
        >
          🌳 Plant trees
        </button>
        <button
          type="button"
          className={`btn-secondary ${intervention === 'shade' ? 'active' : ''}`}
          onClick={() => setIntervention('shade')}
          style={{ fontSize: '10px', padding: '6px 8px' }}
        >
          ☂ Shade structures
        </button>
        <button
          type="button"
          className={`btn-secondary ${intervention === 'traffic' ? 'active' : ''}`}
          onClick={() => setIntervention('traffic')}
          style={{ fontSize: '10px', padding: '6px 8px' }}
        >
          🚗 Reduce traffic
        </button>
        <button
          type="button"
          className={`btn-secondary ${intervention === 'roof' ? 'active' : ''}`}
          onClick={() => setIntervention('roof')}
          style={{ fontSize: '10px', padding: '6px 8px' }}
        >
          🏢 Cool roofs
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#718895', margin: '6px 0 4px' }}>
        <span>INTENSITY</span>
        <b style={{ color: 'var(--cyan)' }}>{intensity}%</b>
      </div>

      <input
        type="range"
        min="10"
        max="100"
        value={intensity}
        onChange={(e) => setIntensity(Number(e.target.value))}
        style={{ width: '100%', marginBottom: '10px', accentColor: 'var(--cyan)' }}
      />

      <button
        type="button"
        className="btn-primary"
        onClick={handleRunSim}
        style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: '11px' }}
      >
        RUN DIGITAL-TWIN SIMULATION
      </button>

      {result && (
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
            <div style={{ padding: '6px 8px', background: 'var(--panel2)', borderRadius: '6px', border: '1px solid #dbe7eb' }}>
              <small style={{ display: 'block', fontSize: '8px', color: 'var(--muted)' }}>INTERVENTION</small>
              <b style={{ fontSize: '11px', color: 'var(--cyan)' }}>{result.interventionLabel}</b>
            </div>
            <div style={{ padding: '6px 8px', background: 'var(--panel2)', borderRadius: '6px', border: '1px solid #dbe7eb' }}>
              <small style={{ display: 'block', fontSize: '8px', color: 'var(--muted)' }}>INTENSITY</small>
              <b style={{ fontSize: '11px', color: 'var(--cyan)' }}>{result.intensity}</b>
            </div>
            <div style={{ padding: '6px 8px', background: 'var(--panel2)', borderRadius: '6px', border: '1px solid #dbe7eb' }}>
              <small style={{ display: 'block', fontSize: '8px', color: 'var(--muted)' }}>EST. TEMP DROP</small>
              <b style={{ fontSize: '11px', color: '#15803d' }}>−{result.tempDrop}°C</b>
            </div>
            <div style={{ padding: '6px 8px', background: 'var(--panel2)', borderRadius: '6px', border: '1px solid #dbe7eb' }}>
              <small style={{ display: 'block', fontSize: '8px', color: 'var(--muted)' }}>EST. PM2.5 DROP</small>
              <b style={{ fontSize: '11px', color: '#15803d' }}>−{result.pmDrop}</b>
            </div>
          </div>

          <div className="telemetry-grid" style={{ marginBottom: '8px' }}>
            <div className="telemetry-read">
              <small>SIM TEMP</small>
              <b>{result.simTemp}°C</b>
            </div>
            <div className="telemetry-read">
              <small>SIM PM2.5</small>
              <b>{result.simPm}</b>
            </div>
          </div>

          <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '6px' }}>Temperature impact</div>
          <div style={{ height: '5px', background: '#dce8ed', borderRadius: '10px', overflow: 'hidden', marginTop: '2px', marginBottom: '6px' }}>
            <div style={{ height: '100%', width: `${result.tempImpactPercent}%`, background: 'var(--cyan)', transition: 'width 0.4s' }}></div>
          </div>

          <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Air-quality impact</div>
          <div style={{ height: '5px', background: '#dce8ed', borderRadius: '10px', overflow: 'hidden', marginTop: '2px' }}>
            <div style={{ height: '100%', width: `${result.pmImpactPercent}%`, background: 'var(--cyan)', transition: 'width 0.4s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
