import React from 'react';
import CampusMap from '../components/map/CampusMap';
import MapToolbar from '../components/map/MapToolbar';
import MapSearchBar from '../components/map/MapSearchBar';
import MapLegend from '../components/map/MapLegend';
import MapZoneDrawer from '../components/map/MapZoneDrawer';
import { useCampus } from '../context/CampusContext';

export default function MapView() {
  const { zones, searchQuery } = useCampus();

  const matchingCount = zones.filter((z) => {
    const q = searchQuery.trim().toLowerCase();
    return !q || z.name.toLowerCase().includes(q) || z.code.toLowerCase().includes(q);
  }).length;

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Campus GIS Map Studio</h2>
          <p>Full-scale interactive spatial digital twin of SOA ITER Campus with multi-layer overlays, real-time telemetry markers, and emergency evacuation paths.</p>
        </div>
        <div className="view-actions">
          <MapSearchBar />
          <MapLegend />
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <MapToolbar />
      </div>

      <div className="dashboard-layout">
        {/* Main Full-Height Map Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="panel-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
            <CampusMap height="580px" />
            <div
              style={{
                position: 'absolute',
                bottom: '14px',
                left: '14px',
                zIndex: 500,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbdbe1',
                fontSize: '11px',
                color: 'var(--muted)',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}
            >
              {searchQuery ? (
                <span>Filtering: <b style={{ color: 'var(--cyan)' }}>{matchingCount} of {zones.length} zones</b> matching "{searchQuery}"</span>
              ) : (
                <span>SOA ITER Campus · <b>20 zones · 5 road segments active</b></span>
              )}
            </div>
          </div>
        </div>

        {/* Telemetry and Corridor Details Drawer */}
        <div>
          <MapZoneDrawer />
        </div>
      </div>
    </div>
  );
}
