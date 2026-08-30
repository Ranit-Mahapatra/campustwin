import React from 'react';
import { ShieldCheck, PhoneCall, Radio } from 'lucide-react';

export default function SafetyProtocolCard() {
  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Campus Safety Protocols</span>
        <ShieldCheck size={14} color="#16a34a" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>
        <div style={{ padding: '8px 10px', background: 'var(--panel2)', borderRadius: '6px', border: '1px solid #e0eaee' }}>
          <b style={{ color: 'var(--text)', display: 'block', marginBottom: '2px' }}>Assembly Points:</b>
          Primary Safe Assembly: Central Library Courtyard (Z-06 / Safe Destination). Secondary: Garden (Z-15).
        </div>

        <div style={{ padding: '8px 10px', background: 'var(--panel2)', borderRadius: '6px', border: '1px solid #e0eaee' }}>
          <b style={{ color: 'var(--text)', display: 'block', marginBottom: '2px' }}>Emergency Dispatch:</b>
          Campus Security Control Room: +91-674-2350181 · Internal Extension: #100 / #108.
        </div>

        <div style={{ padding: '8px 10px', background: 'var(--panel2)', borderRadius: '6px', border: '1px solid #e0eaee' }}>
          <b style={{ color: 'var(--text)', display: 'block', marginBottom: '2px' }}>Automated Threshold Monitoring:</b>
          Real-time alerts fire when Ambient Temp &gt; 38°C, PM2.5 &gt; 90 µg/m³, or Transit Congestion &gt; 80%.
        </div>
      </div>
    </div>
  );
}
