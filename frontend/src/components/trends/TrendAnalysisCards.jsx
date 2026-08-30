import React from 'react';
import { Flame, Wind, Car, Sparkles, TrendingUp } from 'lucide-react';

export default function TrendAnalysisCards({ range, metric }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '14px' }}>
      <div className="panel-card" style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#fee2e2', color: '#dc2626', display: 'grid', placeItems: 'center' }}>
            <Flame size={14} />
          </div>
          <b style={{ fontSize: '12px', color: 'var(--text)' }}>Diurnal Thermal Spike</b>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
          Peak campus heat occurs between <b>12 PM – 2 PM (35°C)</b>, driven by asphalt solar absorption near the Parking Lot (Z-02) and Main Gate.
        </p>
      </div>

      <div className="panel-card" style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#fef9c3', color: '#ca8a04', display: 'grid', placeItems: 'center' }}>
            <Wind size={14} />
          </div>
          <b style={{ fontSize: '12px', color: 'var(--text)' }}>Particulate PM2.5 Inversion</b>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
          Air pollution peaks concurrently with afternoon vehicle ingress reaching <b>67 µg/m³</b>, before recovering to baseline 35 µg/m³ post midnight.
        </p>
      </div>

      <div className="panel-card" style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#e0f2fe', color: '#0284c7', display: 'grid', placeItems: 'center' }}>
            <Car size={14} />
          </div>
          <b style={{ fontSize: '12px', color: 'var(--text)' }}>Transit Peak Correlation</b>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
          Transit corridors hit <b>88% congestion load at 2 PM</b>, directly driving localized heat and acoustic emission surges along R-01 and R-03.
        </p>
      </div>
    </div>
  );
}
