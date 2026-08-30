import React from 'react';
import { Send } from 'lucide-react';

export default function CopilotInputBar({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
      <input
        id="copilot-input"
        type="text"
        placeholder="Ask CampusTwin about heat, traffic corridors, tree deficit, PM2.5 hotspots, or simulations..."
        aria-label="Ask CampusTwin"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          padding: '10px 14px',
          borderRadius: '8px',
          border: '1px solid #cbdbe1',
          fontSize: '13px',
          color: 'var(--text)',
          background: '#ffffff'
        }}
      />
      <button
        type="submit"
        id="copilot-send-btn"
        className="btn-primary"
        style={{ padding: '0 18px', fontSize: '12px' }}
      >
        <Send size={14} /> Ask Copilot
      </button>
    </form>
  );
}
