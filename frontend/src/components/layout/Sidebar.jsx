import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Layers,
  TrendingUp,
  FlaskConical,
  Bot,
  AlertTriangle
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Overview Dashboard', icon: LayoutDashboard, end: true },
  { to: '/map', label: 'Interactive Map', icon: Map },
  { to: '/zones', label: 'Campus Zones', icon: Layers },
  { to: '/trends', label: 'Urban Trends', icon: TrendingUp },
  { to: '/simulation', label: 'What-If Simulation', icon: FlaskConical },
  { to: '/copilot', label: 'Campus Copilot', icon: Bot },
  { to: '/alerts', label: 'Alerts & Emergency', icon: AlertTriangle },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-title">Twin Modules</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon className="nav-link-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-box" style={{ marginTop: 'auto' }}>
        <h3>Risk Legend</h3>
        <div className="legend-item">
          <span><i className="legend-key" style={{ background: '#4ade80' }}></i>Good / Low</span>
          <b style={{ color: '#15803d' }}>SAFE</b>
        </div>
        <div className="legend-item">
          <span><i className="legend-key" style={{ background: '#f5b942' }}></i>Moderate</span>
          <b style={{ color: '#b45309' }}>WATCH</b>
        </div>
        <div className="legend-item">
          <span><i className="legend-key" style={{ background: '#ef4444' }}></i>High / Severe</span>
          <b style={{ color: '#b91c1c' }}>ALERT</b>
        </div>
      </div>

      <div className="sidebar-box">
        <h3>Data Confidence</h3>
        <div className="confidence-note">
          Solid marker border = sensor-backed reading. Dashed border = modeled/estimated reading, matching your original prototype.
        </div>
      </div>
    </aside>
  );
}
