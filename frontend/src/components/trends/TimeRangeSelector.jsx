import React from 'react';
import { Clock, Calendar } from 'lucide-react';

export default function TimeRangeSelector({ range, setRange }) {
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      <button
        type="button"
        className={`btn-secondary ${range === '24h' ? 'active' : ''}`}
        onClick={() => setRange('24h')}
        style={{ fontSize: '11px', padding: '7px 12px' }}
      >
        <Clock size={13} /> 24 Hours (Hourly)
      </button>
      <button
        type="button"
        className={`btn-secondary ${range === '7d' ? 'active' : ''}`}
        onClick={() => setRange('7d')}
        style={{ fontSize: '11px', padding: '7px 12px' }}
      >
        <Calendar size={13} /> 7 Days (Weekly)
      </button>
    </div>
  );
}
