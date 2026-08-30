import React from 'react';
import { Search } from 'lucide-react';

export default function ZoneSearch({ value, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#ffffff',
        border: '1px solid #d0dfe5',
        borderRadius: '8px',
        padding: '8px 12px',
        boxShadow: '0 4px 14px rgba(35, 72, 86, 0.06)',
        width: '260px'
      }}
    >
      <Search size={14} color="var(--muted)" />
      <input
        type="text"
        placeholder="Filter by zone name, code..."
        aria-label="Filter zones"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: '12px',
          width: '100%',
          color: 'var(--text)'
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{ border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', padding: 0 }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
