import React from 'react';

export default function MapLegend() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 14px',
        background: 'rgba(255, 255, 255, 0.96)',
        border: '1px solid #d2e0e6',
        borderRadius: '8px',
        boxShadow: '0 4px 14px rgba(30, 70, 85, 0.08)',
        fontSize: '10px',
        color: '#617984'
      }}
    >
      <b style={{ color: '#3d5a65' }}>Risk Index:</b>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <i style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#58a979', display: 'inline-block' }}></i>
        Low
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <i style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d6ad43', display: 'inline-block' }}></i>
        Moderate
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <i style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e78048', display: 'inline-block' }}></i>
        High
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <i style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d65d5d', display: 'inline-block' }}></i>
        Critical
      </span>
    </div>
  );
}
