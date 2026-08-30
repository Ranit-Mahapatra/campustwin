import React from 'react';
import { Wind, Flame, Car, Activity } from 'lucide-react';
import { trendMetricInfo } from '../../data/baselineTrends';

export default function MetricSelector({ metric, setMetric }) {
  const getIcon = (key) => {
    switch (key) {
      case 'aqi':
        return <Activity size={13} />;
      case 'temp':
        return <Flame size={13} />;
      case 'traffic':
        return <Car size={13} />;
      case 'pm25':
        return <Wind size={13} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '10px 14px',
        background: '#ffffff',
        border: '1px solid #d0dfe5',
        borderRadius: '10px',
        boxShadow: '0 4px 14px rgba(35, 72, 86, 0.04)'
      }}
    >
      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginRight: '4px' }}>
        Select Metric:
      </span>

      {Object.entries(trendMetricInfo).map(([key, info]) => {
        const isActive = metric === key;
        return (
          <button
            key={key}
            type="button"
            className={`btn-secondary ${isActive ? 'active' : ''}`}
            onClick={() => setMetric(key)}
            style={{
              fontSize: '11px',
              padding: '6px 12px',
              borderColor: isActive ? info.color : undefined,
              color: isActive ? info.color : undefined,
              background: isActive ? info.bg : undefined
            }}
          >
            {getIcon(key)} {info.label} {info.unit && `(${info.unit.trim()})`}
          </button>
        );
      })}
    </div>
  );
}
