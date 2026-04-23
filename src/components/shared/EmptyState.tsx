import React from 'react';
import { IonButton, IonCard, IonIcon } from '@ionic/react';
import { folderOpenOutline } from 'ionicons/icons';
import './shared.css';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = folderOpenOutline,
  title = 'No hay datos',
  description = 'Aún no hay elementos para mostrar aquí.',
  actionText,
  onAction,
}) => {
  return (
    <IonCard className="empty-state">
      <IonCard className="empty-state-icon-wrapper">
        <IonIcon icon={icon} />
      </IonCard>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionText && onAction && (
        <IonButton color="primary" onClick={onAction}>
          {actionText}
        </IonButton>
      )}
    </IonCard>
  );
};

export default EmptyState;
