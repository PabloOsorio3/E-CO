import React from 'react';
import { IonCard } from '@ionic/react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import './shared.css';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

interface StatusBadgeProps {
  statusId: number;
}

const getVariant = (name: string): BadgeVariant => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('activ')) return 'success';
  if (lowerName.includes('inactiv')) return 'neutral';
  if (lowerName.includes('agotad')) return 'danger';
  return 'primary';
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusId }) => {
  const statuses = useSelector((state: RootState) => state.status.items);
  const statusObj = statuses.find(s => s.id_status === statusId);

  const text = statusObj ? statusObj.name : 'Desconocido';
  const variant = statusObj ? getVariant(statusObj.name) : 'neutral';

  return (
    <IonCard className={`status-badge status-badge--${variant}`}>
      <span className="badge-dot" />
      {text}
    </IonCard>
  );
};

export default StatusBadge;
