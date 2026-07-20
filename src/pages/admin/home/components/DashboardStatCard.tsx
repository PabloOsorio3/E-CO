import React from 'react';
import { IonIcon } from '@ionic/react';
import { ellipsisVertical, trendingUpOutline, trendingDownOutline } from 'ionicons/icons';

interface DashboardStatCardProps {
  title: string;
  value: string;
  trendValue?: number;
  trendLabel?: string;
  onDetails: () => void;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  trendValue,
  trendLabel = 'vs. mes anterior',
  onDetails,
}) => {
  const isPositive = trendValue !== undefined && trendValue >= 0;

  return (
    <div className="home-card home-stat-card">
      <div className="home-stat-card-header">
        <span className="home-stat-card-title">{title}</span>
        <IonIcon icon={ellipsisVertical} className="home-card-menu-icon" />
      </div>
      <span className="home-stat-card-period">Últimos 7 días</span>
      <div className="home-stat-card-value-row">
        <span className="home-stat-card-value">{value}</span>
        {trendValue !== undefined && (
          <span className={`home-stat-trend ${isPositive ? 'is-up' : 'is-down'}`}>
            <IonIcon icon={isPositive ? trendingUpOutline : trendingDownOutline} />
            {isPositive ? '+' : ''}{trendValue}%
          </span>
        )}
      </div>
      {trendValue !== undefined && <span className="home-stat-card-hint">{trendLabel}</span>}
      <button className="home-details-btn" onClick={onDetails}>Details</button>
    </div>
  );
};

export default DashboardStatCard;
