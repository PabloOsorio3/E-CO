import React from 'react';
import { IonCard } from '@ionic/react';
import './shared.css';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

interface StatusBadgeProps {
  text: string;
  variant?: BadgeVariant;
  showDot?: boolean;
}
const StatusBadge: React.FC<StatusBadgeProps> = ({
  text,
  variant = 'neutral',
  showDot = true,
}) => {
  return (
    <IonCard className={`status-badge status-badge--${variant}`}>
      {showDot && <span className="badge-dot" />}
      {text}
    </IonCard>
  );
};

export default StatusBadge;
