import React, { useState } from 'react';
import TimeRangeSelector from '../components/trends/TimeRangeSelector';
import MetricSelector from '../components/trends/MetricSelector';
import TrendChart from '../components/trends/TrendChart';
import TrendStatsGrid from '../components/trends/TrendStatsGrid';
import TrendAnalysisCards from '../components/trends/TrendAnalysisCards';
import { trendMetricInfo } from '../data/baselineTrends';

export default function TrendsView() {
  const [range, setRange] = useState('24h');
  const [metric, setMetric] = useState('aqi');
  const info = trendMetricInfo[metric];

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Urban Environmental Trends & Historical Analytics</h2>
          <p>Multi-temporal microclimate trajectories, air quality cycles, and transit congestion patterns across SOA ITER Campus.</p>
        </div>
        <div className="view-actions">
          <TimeRangeSelector range={range} setRange={setRange} />
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <MetricSelector metric={metric} setMetric={setMetric} />
      </div>

      <div className="dashboard-layout">
        {/* Main Chart Area */}
        <div className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-title">
            <span>{info.label} Historical Trajectory</span>
            <span className="badge-pill badge-mod">{range === '24h' ? '24-Hour Hourly Series' : '7-Day Weekly Pattern'}</span>
          </div>

          <div style={{ flex: 1, minHeight: '340px', padding: '10px 0' }}>
            <TrendChart range={range} metric={metric} height="340px" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--line)', fontSize: '11px', color: 'var(--muted)' }}>
            <span>Data source: SOA ITER IoT Sensor Network + Microclimate Interpolation</span>
            <span>Refreshed: Today at 12:00 AM</span>
          </div>
        </div>

        {/* Statistical Summary Column */}
        <div>
          <TrendStatsGrid range={range} metric={metric} />
        </div>
      </div>

      {/* Analysis Insights */}
      <TrendAnalysisCards range={range} metric={metric} />
    </div>
  );
}
