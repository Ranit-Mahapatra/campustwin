import React from 'react';
import { Link } from 'react-router-dom';
import { Map, FlaskConical, AlertTriangle, Layers } from 'lucide-react';
import MapPreview from '../components/dashboard/MapPreview';
import SelectedZoneCard from '../components/dashboard/SelectedZoneCard';
import StreetIntelligenceCard from '../components/dashboard/StreetIntelligenceCard';
import MiniTrendChart from '../components/dashboard/MiniTrendChart';
import SimulationWidget from '../components/dashboard/SimulationWidget';
import CampusAlertsList from '../components/dashboard/CampusAlertsList';
import PriorityZonesCard from '../components/dashboard/PriorityZonesCard';
import CopilotWidget from '../components/dashboard/CopilotWidget';
import EmergencyWidget from '../components/dashboard/EmergencyWidget';

export default function DashboardView() {
  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>CampusTwin Digital Twin Dashboard</h2>
          <p>Real-time environmental monitoring, microclimate analytics, what-if simulations, and spatial decision support for SOA ITER Campus.</p>
        </div>
        <div className="view-actions">
          <Link to="/map" className="btn-primary">
            <Map size={14} /> Full GIS Map Studio
          </Link>
          <Link to="/zones" className="btn-secondary">
            <Layers size={14} /> 20 Zones Directory
          </Link>
          <Link to="/simulation" className="btn-secondary">
            <FlaskConical size={14} /> Simulation Sandbox
          </Link>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Main Column: Map + Selected Zone + Street Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <MapPreview />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <SelectedZoneCard />
            <StreetIntelligenceCard />
          </div>
        </div>

        {/* Intelligence Sidebar: Trends, Simulation, Alerts, Priority, Copilot, Emergency */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <MiniTrendChart />
          <SimulationWidget />
          <CampusAlertsList />
          <PriorityZonesCard />
          <CopilotWidget />
          <EmergencyWidget />
        </div>
      </div>
    </div>
  );
}
