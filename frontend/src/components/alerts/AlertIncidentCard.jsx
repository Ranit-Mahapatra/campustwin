import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Flame, Wind, Car } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export default function AlertIncidentCard({ alert }) {
  const navigate = useNavigate();
  const { selectZoneByCode, selectRoadById, setActiveMapLayer } = useCampus();

  const getIcon = () => {
    switch (alert.type) {
      case 'heat':
        return <Flame size={16} />;
      case 'air':
        return <Wind size={16} />;
      case 'traffic':
        return <Car size={16} />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (alert.targetType === 'zone') {
      selectZoneByCode(alert.targetId);
      setActiveMapLayer('campus');
    } else {
      selectRoadById(alert.targetId);
      setActiveMapLayer('roads');
    }
    navigate('/map');
  };

  return (
    <div
      className="panel-card"
      onClick={handleClick}
      style={{
        background: alert.bg,
        border: `1px solid ${alert.border}`,
        cursor: 'pointer',
        padding: '12px 14px',
        transition: 'all 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: alert.iconBg,
              color: alert.iconColor,
              display: 'grid',
              placeItems: 'center'
            }}
          >
            {getIcon()}
          </div>
          <div>
            <b style={{ fontSize: '13px', color: alert.textColor }}>{alert.title}</b>
            <div style={{ fontSize: '11px', color: alert.subColor, marginTop: '2px' }}>
              {alert.location} · <b>{alert.metric}</b>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: alert.iconColor, fontWeight: 700 }}>
          <span>View on Map</span>
          <ArrowUpRight size={15} />
        </div>
      </div>
    </div>
  );
}
