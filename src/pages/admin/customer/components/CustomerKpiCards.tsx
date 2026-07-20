import React from 'react';
import { IonIcon } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import '../../../css/dashboard.css';

interface CustomerKpiCardsProps {
    total: number;
    active: number;
    inactive: number;
}

const CustomerKpiCards: React.FC<CustomerKpiCardsProps> = ({ total, active, inactive }) => {
    return (
        <div className="home-stats-row">
            <div className="home-card home-stat-card">
                <div className="home-stat-card-header">
                    <span className="home-stat-card-title">Total Clientes</span>
                    <IonIcon icon={ellipsisVertical} className="home-card-menu-icon" />
                </div>
                <div className="home-stat-card-value-row">
                    <span className="home-stat-card-value">{total}</span>
                </div>
            </div>

            <div className="home-card home-stat-card">
                <div className="home-stat-card-header">
                    <span className="home-stat-card-title">Activos</span>
                    <IonIcon icon={ellipsisVertical} className="home-card-menu-icon" />
                </div>
                <div className="home-stat-card-value-row">
                    <span className="home-stat-card-value">{active}</span>
                </div>
            </div>

            <div className="home-card home-stat-card">
                <div className="home-stat-card-header">
                    <span className="home-stat-card-title">Inactivos</span>
                    <IonIcon icon={ellipsisVertical} className="home-card-menu-icon" />
                </div>
                <div className="home-stat-card-value-row">
                    <span className="home-stat-card-value">{inactive}</span>
                </div>
            </div>
        </div>
    );
};

export default CustomerKpiCards;
