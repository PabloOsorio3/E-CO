import React from 'react';
import { IonSpinner, IonCard } from '@ionic/react';
import './shared.css';

interface LoadingSpinnerProps {
  text?: string;
  variant?: 'fullscreen' | 'inline';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Cargando...',
  variant = 'fullscreen',
}) => {
  if (variant === 'inline') {
    return (
      <IonCard className="loading-spinner-inline">
        <IonSpinner name="crescent" />
        {text && <span className="loading-text">{text}</span>}
      </IonCard>
    );
  }

  return (
    <IonCard className="loading-spinner-overlay">
      <IonSpinner name="crescent" />
      {text && <span className="loading-text">{text}</span>}
    </IonCard>
  );
};

export default LoadingSpinner;
