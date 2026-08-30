import React from 'react';
import { useCampusMetricsQuery } from '../../hooks/useCampusApi';
import { baselineZones } from '../../data/baselineZones';

export default function MetricRibbon({ zones = baselineZones }) {
  const { data: metrics } = useCampusMetricsQuery();

  const avgTemp = metrics?.avg_temp ?? (zones.reduce((s, z) => s + z.temp, 0) / (zones.length || 1));
  const maxPm = metrics?.max_pm25 ?? Math.max(...zones.map((z) => z.pm25));
  const avgGreen = metrics?.avg_green_cover ?? (zones.reduce((s, z) => s + z.treeCover, 0) / (zones.length || 1));
  const riskZonesCount = metrics?.risk_zones_count ?? zones.filter((z) => z.vulnerability >= 8).length;
  const trafficStatus = metrics?.traffic_status ?? 'HIGH';

  return (
    <div className="metric-ribbon">
      <div className="metric-card">
        <div className="metric-label">AVG TEMP</div>
        <div className="metric-value">
          {typeof avgTemp === 'number' ? avgTemp.toFixed(1) : avgTemp} <span className="metric-unit">°C</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">MAX PM2.5</div>
        <div className="metric-value">
          {maxPm} <span className="metric-unit">µg/m³</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">TRAFFIC</div>
        <div className="metric-value" style={{ color: '#ea580c' }}>
          {trafficStatus}
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">GREEN COVER</div>
        <div className="metric-value">
          {typeof avgGreen === 'number' ? avgGreen.toFixed(0) : avgGreen} <span className="metric-unit">%</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">RISK ZONES</div>
        <div className="metric-value" style={{ color: '#dc2626' }}>
          {riskZonesCount} <span className="metric-unit">flagged</span>
        </div>
      </div>
    </div>
  );
}
