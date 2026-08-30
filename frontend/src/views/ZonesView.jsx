import React, { useState } from 'react';
import ZoneStatsRibbon from '../components/zones/ZoneStatsRibbon';
import ZoneFilters from '../components/zones/ZoneFilters';
import ZoneSearch from '../components/zones/ZoneSearch';
import ZoneCard from '../components/zones/ZoneCard';
import ZoneDetailDrawer from '../components/zones/ZoneDetailDrawer';
import { useCampus } from '../context/CampusContext';

export default function ZonesView() {
  const { zones, selectedZone } = useCampus();
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const filteredZones = zones.filter((z) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      z.name.toLowerCase().includes(q) ||
      z.code.toLowerCase().includes(q) ||
      z.reason.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    if (filterType === 'critical') return z.vulnerability >= 8;
    if (filterType === 'sensor') return z.confidence === 'sensor';
    if (filterType === 'estimate') return z.confidence === 'estimate';
    return z.aqi.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Campus Spatial Zones Directory</h2>
          <p>Comprehensive catalog of all 20 spatial units across SOA ITER Campus with microclimate telemetry, sensor confidence levels, and mitigation priority ratings.</p>
        </div>
        <div className="view-actions">
          <ZoneSearch value={search} onChange={setSearch} />
        </div>
      </div>

      <ZoneStatsRibbon />

      <div style={{ marginBottom: '14px' }}>
        <ZoneFilters filterType={filterType} setFilterType={setFilterType} />
      </div>

      {selectedZone && (
        <div style={{ marginBottom: '16px' }}>
          <ZoneDetailDrawer zone={selectedZone} />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '11px', color: 'var(--muted)' }}>
        <span>Showing <b>{filteredZones.length} of {zones.length} campus zones</b></span>
        {search && <span>Filtered by: "{search}"</span>}
      </div>

      <div className="view-grid-3">
        {filteredZones.map((z) => (
          <ZoneCard
            key={z.code}
            zone={z}
            isSelected={selectedZone?.code === z.code}
          />
        ))}
      </div>
    </div>
  );
}
