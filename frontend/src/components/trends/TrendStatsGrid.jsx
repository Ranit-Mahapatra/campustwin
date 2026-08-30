import React from 'react';
import { baselineTrendData, trendMetricInfo } from '../../data/baselineTrends';

export default function TrendStatsGrid({ range, metric }) {
  const dataset = baselineTrendData[range];
  const info = trendMetricInfo[metric];
  const values = dataset[metric];

  const peak = Math.max(...values);
  const peakIdx = values.indexOf(peak);
  const low = Math.min(...values);
  const lowIdx = values.indexOf(low);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const change = ((values[values.length - 1] - values[0]) / values[0]) * 100;

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Statistical Summary</span>
        <span style={{ color: info.color, fontWeight: 800 }}>{info.label} Analytics</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="telemetry-read">
          <small>PEAK RECORDED</small>
          <b style={{ color: 'var(--red)' }}>
            {peak}{info.unit}
          </b>
          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>at {dataset.labels[peakIdx]}</span>
        </div>

        <div className="telemetry-read">
          <small>SERIES AVERAGE</small>
          <b style={{ color: 'var(--text)' }}>
            {avg.toFixed(1)}{info.unit}
          </b>
          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Across {dataset.labels.length} data points</span>
        </div>

        <div className="telemetry-read">
          <small>NET TREND CHANGE</small>
          <b style={{ color: change >= 0 ? 'var(--red)' : '#16a34a' }}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </b>
          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
            {dataset.labels[0]} ({values[0]}) → {dataset.labels[dataset.labels.length - 1]} ({values[values.length - 1]})
          </span>
        </div>

        <div className="telemetry-read">
          <small>LOWEST OBSERVED</small>
          <b style={{ color: '#16a34a' }}>
            {low}{info.unit}
          </b>
          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>at {dataset.labels[lowIdx]}</span>
        </div>
      </div>
    </div>
  );
}
