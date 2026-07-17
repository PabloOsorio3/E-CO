import React from 'react';
import { IonIcon, IonMenuButton } from '@ionic/react';
import { searchOutline, notificationsOutline, sunnyOutline, moonOutline } from 'ionicons/icons';
import { showSuccessAlert } from '../../../../alerts/success/success-alert';

interface CustomerTopBarProps {
    darkMode: boolean;
    onToggleDarkMode: () => void;
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

const CustomerTopBar: React.FC<CustomerTopBarProps> = ({ darkMode, onToggleDarkMode, searchQuery, onSearchChange }) => {
    return (
        <div className="dashboard-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="dashboard-title-area" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IonMenuButton style={{ color: 'var(--dash-text)', '--color': 'var(--dash-text)' }} />
                <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: 'var(--dash-text)' }}>Customers</h1>
            </div>

            <div className="dashboard-actions-area" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Search */}
                <div className="search-input-container">
                    <IonIcon icon={searchOutline} />
                    <input
                        type="text"
                        placeholder="Search data, users, or reports"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Notifications */}
                <button
                    className="icon-action-btn"
                    onClick={() => showSuccessAlert('No hay nuevas notificaciones')}
                >
                    <IonIcon icon={notificationsOutline} />
                </button>

                {/* Theme Toggle */}
                <button
                    className="icon-action-btn"
                    onClick={onToggleDarkMode}
                    title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                >
                    <IonIcon icon={darkMode ? sunnyOutline : moonOutline} />
                </button>

                {/* User Profile Avatar */}
                <div className="user-header-avatar">
                    <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                        alt="Admin User"
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerTopBar;
