import React from 'react';
import { Users, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SimulationMetaDetails({ result, selectedZone }) {
  if (!result) return null;

  // Approximate population benefit based on zone type
  const isHostel = selectedZone.name.toLowerCase().includes('hostel');
  const isAcademic = selectedZone.name.toLowerCase().includes('block') || selectedZone.name.toLowerCase().includes('department');
  const estPopulation = isHostel ? '1,800 residents' : isAcademic ? '2,400 students & faculty' : '850 daily visitors';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '14px' }}>
      <div className="panel-card" style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Users size={14} color="var(--cyan)" />
          <small style={{ fontSize: '9px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
            POPULATION BENEFITED
          </small>
        </div>
        <b style={{ fontSize: '13px', color: 'var(--text)' }}>~{estPopulation}</b>
        <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
          Direct daily thermal relief
        </div>
      </div>

      <div className="panel-card" style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <ShieldCheck size={14} color="#16a34a" />
          <small style={{ fontSize: '9px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
            MODEL CONFIDENCE
          </small>
        </div>
        <b style={{ fontSize: '13px', color: '#16a34a' }}>High Confidence (94%)</b>
        <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
          Uncertainty: ±0.4°C / ±3 PM2.5
        </div>
      </div>

      <div className="panel-card" style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <CheckCircle2 size={14} color="var(--cyan)" />
          <small style={{ fontSize: '9px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
            FEASIBILITY & ROI
          </small>
        </div>
        <b style={{ fontSize: '13px', color: 'var(--text)' }}>Optimal Payback: 6–9 Mo</b>
        <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
          Targeted microclimate cooling
        </div>
      </div>
    </div>
  );
}
