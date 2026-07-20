import React from 'react';
import { IonIcon } from '@ionic/react';
import { barChartOutline } from 'ionicons/icons';

interface PlaceholderCardProps {
  title: string;
  className?: string;
  message?: string;
}

const PlaceholderCard: React.FC<PlaceholderCardProps> = ({
  title,
  className = '',
  message = 'Datos no disponibles todavía',
}) => {
  return (
    <div className={`home-card home-placeholder-card ${className}`}>
      <div className="home-card-title-row">
        <h2>{title}</h2>
      </div>
      <div className="home-placeholder-body">
        <IonIcon icon={barChartOutline} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default PlaceholderCard;
