import React from 'react';
import { IonIcon, IonCard } from '@ionic/react';
import { trendingUpOutline, trendingDownOutline } from 'ionicons/icons';
import './shared.css';

type StatVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  variant?: StatVariant;
  trendValue?: number;
  periodText?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  variant = 'primary',
  trendValue,
  periodText,
}) => {
  const isPositive = trendValue !== undefined && trendValue >= 0;

  return (
    <IonCard className={`stat-card stat-card--${variant}`}>
      <IonCard className="stat-card-header">
        <span className="stat-label">{label}</span>
        <IonCard className="stat-icon-wrap">
          <IonIcon icon={icon} />
        </IonCard>
      </IonCard>

      <span className="stat-card-value">{value}</span>

      {trendValue !== undefined && (
        <IonCard className="stat-card-footer">
          <span className={`stat-card-trend stat-card-trend--${isPositive ? 'up' : 'down'}`}>
            <IonIcon icon={isPositive ? trendingUpOutline : trendingDownOutline} />
            {isPositive ? '+' : ''}{trendValue}%
          </span>
          {periodText && <span className="stat-card-period">{periodText}</span>}
        </IonCard>
      )}
    </IonCard>
  );
};

export default StatCard;
