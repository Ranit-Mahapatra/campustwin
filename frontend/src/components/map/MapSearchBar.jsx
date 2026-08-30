import React from 'react';
import { Search } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export default function MapSearchBar() {
  const { searchQuery, setSearchQuery } = useCampus();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: '#ffffff',
        border: '1px solid #d2e0e6',
        borderRadius: '8px',
        boxShadow: '0 4px 14px rgba(30, 70, 85, 0.08)',
        minWidth: '220px'
      }}
    >
      <Search size={14} color="#5f7b87" />
      <input
        id="zone-search"
        type="text"
        placeholder="Search campus area..."
        aria-label="Search campus area"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: '#294551',
          fontSize: '11px',
          width: '100%'
        }}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          style={{ border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', padding: 0 }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
