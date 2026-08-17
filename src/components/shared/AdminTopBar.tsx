import React from 'react';
import { IonHeader, IonIcon, IonMenuButton, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  arrowBackOutline,
  moonOutline,
  notificationsOutline,
  personCircleOutline,
  searchOutline,
  sunnyOutline,
} from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleDarkMode } from '../../store/slices/theme.slice';
import { showSuccessAlert } from '../../alerts/success/success-alert';
import './shared.css';

interface AdminTopBarProps {
  title: string;
  backTo?: string;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  action?: {
    icon: string;
    onClick: () => void;
    label?: string;
  };
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ title, backTo, search, action }) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  return (
    <IonHeader className="ion-no-border" style={{ background: 'var(--dash-bg)' }}>
      <IonToolbar
        style={{
          '--background': 'var(--dash-bg)',
          '--border-style': 'none',
          padding: '16px 24px 8px 24px',
        } as React.CSSProperties}
      >
        <div className={`admin-top-bar ${darkMode ? 'dark-theme' : ''}`}>
          <div className="admin-top-bar-title-area">
            {backTo ? (
              <button className="admin-top-bar-icon-btn" onClick={() => history.push(backTo)} title="Volver">
                <IonIcon icon={arrowBackOutline} />
              </button>
            ) : (
              <IonMenuButton style={{ color: 'var(--dash-text)', '--color': 'var(--dash-text)' } as React.CSSProperties} />
            )}
            <h1>{title}</h1>
          </div>

          <div className="admin-top-bar-actions-area">
            {search && (
              <div className="admin-top-bar-search">
                <IonIcon icon={searchOutline} />
                <input
                  type="text"
                  placeholder={search.placeholder ?? 'Buscar...'}
                  value={search.value}
                  onChange={(e) => search.onChange(e.target.value)}
                />
              </div>
            )}

            {action && (
              <button className="admin-top-bar-icon-btn" onClick={action.onClick} title={action.label}>
                <IonIcon icon={action.icon} />
              </button>
            )}

            <button
              className="admin-top-bar-icon-btn"
              onClick={() => showSuccessAlert('No hay nuevas notificaciones')}
              title="Notificaciones"
            >
              <IonIcon icon={notificationsOutline} />
            </button>

            <button
              className="admin-top-bar-icon-btn"
              onClick={() => dispatch(toggleDarkMode())}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              <IonIcon icon={darkMode ? sunnyOutline : moonOutline} />
            </button>

            <button className="admin-top-bar-avatar" onClick={() => history.push('/admin/profile')} title="Mi perfil">
              <IonIcon icon={personCircleOutline} />
            </button>
          </div>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default AdminTopBar;
