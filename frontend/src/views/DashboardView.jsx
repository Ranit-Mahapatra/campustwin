import React from 'react';
import { Link } from 'react-router-dom';
import { Map, FlaskConical, Layers, MapPin } from 'lucide-react';
import { useCampus } from '../context/CampusContext';
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
  const { selectedCampus, switchCampus, setSelectedCampus, zones } = useCampus();

  const currentSelection =
    selectedCampus === 'smart_city'
      ? 'Smart City Grid'
      : selectedCampus === 'soa_campus_2'
      ? 'Campus 2'
      : 'SOA Campus';

  const handleLocationChange = (e) => {
    const val = e.target.value;
    if (switchCampus) {
      switchCampus(val);
    } else if (setSelectedCampus) {
      setSelectedCampus(val);
    }
  };

  const getSubTitle = () => {
    if (selectedCampus === 'smart_city') {
      return 'Real-time environmental monitoring, municipal heat island analytics, and ward-level cooling simulations for Bhubaneswar Smart City.';
    }
    if (selectedCampus === 'soa_campus_2') {
      return 'Real-time environmental monitoring and spatial decision support for SOA Campus 2 (Khandagiri / IMS Medical Quad).';
    }
    return 'Real-time environmental monitoring, microclimate analytics, what-if simulations, and spatial decision support for SOA ITER Campus.';
  };

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>CampusTwin Digital Twin Dashboard</h2>
          <p>{getSubTitle()}</p>
        </div>
        <div className="view-actions">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} style={{ color: 'var(--cyan)' }} />
            <select
              id="select-location"
              name="location"
              aria-label="Select Location"
              value={currentSelection}
              onChange={handleLocationChange}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbdbe1',
                background: '#ffffff',
                color: 'var(--text)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="SOA Campus">SOA Campus</option>
              <option value="Campus 2">Campus 2</option>
              <option value="Smart City Grid">Smart City Grid</option>
            </select>
          </div>
          <Link to="/map" className="btn-primary">
            <Map size={14} /> Full GIS Map Studio
          </Link>
          <Link to="/zones" className="btn-secondary">
            <Layers size={14} /> {zones?.length || 10} Zones Directory
          </Link>
          <Link to="/simulation" className="btn-secondary">
            <FlaskConical size={14} /> Simulation Sandbox
          </Link>
        </div>
      </div>

      <div className="dashboard-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Key forces Leaflet to re-center instantly across campus & city grids */}
          <MapPreview key={selectedCampus} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <SelectedZoneCard />
            <StreetIntelligenceCard />
          </div>
        </div>

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