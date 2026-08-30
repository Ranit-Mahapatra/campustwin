import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { baselineZones } from '../../data/baselineZones';
import { baselineRoads } from '../../data/baselineRoads';

const ROUTE_TITLES = {
  '/': 'Overview Dashboard',
  '/map': 'Interactive Map',
  '/zones': 'Campus Zones Directory',
  '/trends': 'Urban Trends',
  '/simulation': 'What-If Simulation',
  '/copilot': 'Campus Copilot',
  '/alerts': 'Alerts & Emergency',
};

export default function Header({ isSidebarOpen, onToggleSidebar }) {
  const location = useLocation();
  const zoneCount = baselineZones.length;
  const roadCount = baselineRoads.length;
  const currentTitle = ROUTE_TITLES[location.pathname] || 'CampusTwin Module';

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" className="header-brand">
          <div className="header-logo">CT</div>
          <div className="header-titles">
            <h1>CampusTwin</h1>
            <div className="sub">ITER • SOA — Environmental Monitoring & Decision Support</div>
          </div>
        </Link>
        <div className="header-route-badge">
          <span style={{ color: 'var(--muted)', marginRight: '6px' }}>/</span>
          {currentTitle}
        </div>
      </div>

      <div className="header-telemetry">
        <div className="live-indicator">
          <span className="pulse-dot"></span>
          <span>CAMPUS MONITOR</span>
        </div>
        <div className="telemetry-meta">
          <span style={{ color: '#94a3b8' }}>|</span> {zoneCount} zones · {roadCount} road segments
        </div>

        <button
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
