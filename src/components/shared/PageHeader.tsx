import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonBackButton,
} from '@ionic/react';
import './shared.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showMenuButton?: boolean;
  showBackButton?: boolean;
  defaultBackHref?: string;
  actionIcon?: string;
  onAction?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showMenuButton = true,
  showBackButton = false,
  defaultBackHref = '/',
  actionIcon,
  onAction,
}) => {
  return (
    <IonHeader className="ion-no-border">
      <IonToolbar className="page-header-toolbar">
        {/* Lado izquierdo */}
        <IonButtons slot="start">
          {showBackButton ? (
            <IonBackButton defaultHref={defaultBackHref} color="primary" />
          ) : showMenuButton ? (
            <IonMenuButton color="primary" />
          ) : null}
        </IonButtons>

        {/* Título */}
        <IonTitle>
          {title}
          {subtitle && <div className="header-subtitle">{subtitle}</div>}
        </IonTitle>

        {/* Lado derecho: Acción */}
        {actionIcon && onAction && (
          <IonButtons slot="end">
            <IonButton onClick={onAction}>
              <IonIcon icon={actionIcon} color="primary" />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default PageHeader;
