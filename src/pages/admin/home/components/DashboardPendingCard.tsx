import React from 'react';
import { IonIcon } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';

interface DashboardPendingCardProps {
  pending: number;
  canceled: number;
  onDetails: () => void;
}

const DashboardPendingCard: React.FC<DashboardPendingCardProps> = ({ pending, canceled, onDetails }) => {
  return (
    <div className="home-card home-stat-card">
      <div className="home-stat-card-header">
        <span className="home-stat-card-title">Pending &amp; Canceled</span>
        <IonIcon icon={ellipsisVertical} className="home-card-menu-icon" />
      </div>
      <span className="home-stat-card-period">Últimos 7 días</span>
      <div className="home-pending-row">
        <div className="home-pending-col">
          <span className="home-pending-label">Pending</span>
          <span className="home-pending-value is-pending">{pending}</span>
        </div>
        <div className="home-pending-divider" />
        <div className="home-pending-col">
          <span className="home-pending-label">Canceled</span>
          <span className="home-pending-value is-canceled">{canceled}</span>
        </div>
      </div>
      <button className="home-details-btn" onClick={onDetails}>Details</button>
    </div>
  );
};

export default DashboardPendingCard;
