import React from 'react';
import { Link } from 'react-router-dom';
import { Map, FlaskConical, Layers, MapPin, Radio, Zap, AlertTriangle } from 'lucide-react';
import { useCampus, calculateDynamicAqi } from '../context/CampusContext';
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
  const { 
    selectedCampus, 
    switchCampus, 
    selectedZone, 
    triggerManualAqiSpike, 
    isIotActive, 
    setIsIotActive, 
    lastSpikeEvent 
  } = useCampus();

  const dynamicAqi = calculateDynamicAqi(selectedZone?.pm25 || 50);

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>CampusTwin Digital Twin Dashboard</h2>
          <p>Real-time environmental monitoring, dynamic AQI recalculations, and live IoT surge alerts.</p>
        </div>

        <div className="view-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          
          {/* Live IoT Sensor Feed Status */}
          <div 
            onClick={() => setIsIotActive(!isIotActive)}
            title="Click to toggle live polling"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: isIotActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${isIotActive ? '#10b981' : '#ef4444'}`,
              color: isIotActive ? '#059669' : '#dc2626',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Radio size={14} className={isIotActive ? 'animate-pulse' : ''} />
            <span>{isIotActive ? 'LIVE IoT SENSORS (3s)' : 'IoT STREAM PAUSED'}</span>
          </div>

          {/* Quick AQI Spike Simulation Trigger */}
          <button
            onClick={() => triggerManualAqiSpike(selectedZone?.code, 35)}
            className="btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fff1f2',
              color: '#e11d48',
              borderColor: '#fda4af',
              fontWeight: 700,
              fontSize: '11px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px'
            }}
          >
            <Zap size={14} /> Simulate AQI Spike (+35 PM)
          </button>

          {/* Campus Selector */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} style={{ color: 'var(--cyan, #0284c7)' }} />
            <select
              id="select-location"
              name="location"
              aria-label="Select Location"
              value={selectedCampus}
              onChange={(e) => switchCampus(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbdbe1',
                background: '#ffffff',
                color: 'var(--text, #334155)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="soa_iter">SOA ITER (Main)</option>
              <option value="soa_campus_2">Campus 2 (Medical)</option>
              <option value="smart_city">Bhubaneswar Smart City</option>
            </select>
          </div>

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

      {/* Dynamic AQI Sudden Spike Banner Alert */}
      {lastSpikeEvent && (
        <div style={{
          margin: '0 0 14px 0',
          padding: '10px 16px',
          background: '#fff1f2',
          borderLeft: '4px solid #e11d48',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#9f1239',
          fontSize: '12px',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#e11d48" />
            <span>
              <strong>RATE-OF-CHANGE ANOMALY DETECTED:</strong> {lastSpikeEvent.zoneName} ({lastSpikeEvent.zoneCode}) experienced a sudden surge of +{lastSpikeEvent.delta} µg/m³ PM2.5 (Current: {lastSpikeEvent.currentPm} µg/m³ - Band: {dynamicAqi.label}) at {lastSpikeEvent.timestamp}.
            </span>
          </div>
          <span style={{ 
            background: dynamicAqi.color, 
            color: '#fff', 
            padding: '2px 8px', 
            borderRadius: '4px',
            fontSize: '10px',
            textTransform: 'uppercase'
          }}>
            {dynamicAqi.label}
          </span>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="dashboard-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <MapPreview />
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