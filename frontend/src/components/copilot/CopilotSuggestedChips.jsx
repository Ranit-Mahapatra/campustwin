import React from 'react';
import { Sparkles } from 'lucide-react';

const PRESET_QUERIES = [
  'Which area needs trees?',
  'What is the highest PM2.5 zone?',
  'Which is the hottest zone on campus?',
  'What is the busiest road corridor?',
  'Which zones have critical vulnerability?',
  'What is the safest evacuation route?'
];

export default function CopilotSuggestedChips({ onSelectQuery }) {
  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Suggested Decision Queries</span>
        <Sparkles size={14} color="var(--cyan)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {PRESET_QUERIES.map((q, idx) => (
          <button
            key={idx}
            type="button"
            className="btn-secondary"
            onClick={() => onSelectQuery(q)}
            style={{
              textAlign: 'left',
              justifyContent: 'flex-start',
              padding: '9px 12px',
              fontSize: '12px',
              lineHeight: 1.4
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
