import React from 'react';
import { Database, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export default function CopilotKnowledgeScope() {
  const { zones, roads } = useCampus();

  return (
    <div className="panel-card" style={{ marginTop: '12px' }}>
      <div className="panel-title">
        <span>Knowledge Scope</span>
        <Database size={14} color="var(--cyan)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: 'var(--muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={13} color="#16a34a" />
          <span><b>{zones.length} Spatial Zones</b> with microclimate telemetry</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={13} color="#16a34a" />
          <span><b>{roads.length} Transit Corridors</b> with traffic and noise data</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={13} color="#16a34a" />
          <span><b>Digital Twin Simulation Factors</b> (Trees, Shade, Traffic, Roofs)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={13} color="#16a34a" />
          <span><b>Emergency Evacuation Corridors</b> & Safe Destinations</span>
        </div>
      </div>
    </div>
  );
}
