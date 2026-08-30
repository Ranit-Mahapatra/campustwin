import React, { useState } from 'react';
import AlertIncidentCard from '../components/alerts/AlertIncidentCard';
import EmergencyResponsePanel from '../components/alerts/EmergencyResponsePanel';
import PriorityZonesRanking from '../components/alerts/PriorityZonesRanking';
import SafetyProtocolCard from '../components/alerts/SafetyProtocolCard';

const ACTIVE_ALERTS = [
  {
    id: 'alert-1',
    type: 'heat',
    targetType: 'zone',
    targetId: 'Z-11',
    title: 'High Thermal Heat Detected',
    location: "ITER Girls' Hostel (Z-11)",
    metric: 'Current Temp: 40°C',
    bg: '#fff5f5',
    border: '#fecaca',
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    textColor: '#991b1b',
    subColor: '#7f1d1d'
  },
  {
    id: 'alert-2',
    type: 'air',
    targetType: 'zone',
    targetId: 'Z-02',
    title: 'Severe PM2.5 Air Quality Exceeded',
    location: 'Parking Lot (Z-02)',
    metric: 'PM2.5: 114 µg/m³',
    bg: '#fffbeb',
    border: '#fef08a',
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    textColor: '#854d0e',
    subColor: '#713f12'
  },
  {
    id: 'alert-3',
    type: 'traffic',
    targetType: 'road',
    targetId: 'R-01',
    title: 'Heavy Traffic Congestion Corridor',
    location: 'Main Gate Road (R-01)',
    metric: '86% Congestion Load · 14 km/h',
    bg: '#f0f9ff',
    border: '#bae6fd',
    iconBg: '#e0f2fe',
    iconColor: '#0284c7',
    textColor: '#075985',
    subColor: '#0c4a6e'
  }
];

export default function AlertsView() {
  const [filterType, setFilterType] = useState('all');

  const filteredAlerts = ACTIVE_ALERTS.filter((a) => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Campus Alerts & Emergency Response Center</h2>
          <p>Real-time threshold breaches, ranked priority intervention zones, and safest evacuation routing protocols across SOA ITER Campus.</p>
        </div>
        <div className="view-actions">
          <button
            type="button"
            className={`btn-secondary ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Incidents ({ACTIVE_ALERTS.length})
          </button>
          <button
            type="button"
            className={`btn-secondary ${filterType === 'heat' ? 'active' : ''}`}
            onClick={() => setFilterType('heat')}
          >
            Heat Alerts
          </button>
          <button
            type="button"
            className={`btn-secondary ${filterType === 'air' ? 'active' : ''}`}
            onClick={() => setFilterType('air')}
          >
            Air Quality
          </button>
          <button
            type="button"
            className={`btn-secondary ${filterType === 'traffic' ? 'active' : ''}`}
            onClick={() => setFilterType('traffic')}
          >
            Traffic
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Left Column: Active Alerts + Emergency Response */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="panel-card">
            <div className="panel-title">
              <span>Active Campus Alerts</span>
              <span className="badge-pill badge-high">{filteredAlerts.length} Active Incidents</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredAlerts.map((alert) => (
                <AlertIncidentCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>

          <EmergencyResponsePanel />
          <SafetyProtocolCard />
        </div>

        {/* Right Column: Priority Intervention Zones Ranking */}
        <div>
          <PriorityZonesRanking />
        </div>
      </div>
    </div>
  );
}
