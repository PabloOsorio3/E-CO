import React from 'react';
import { IonIcon } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';

const CustomerKpiCards: React.FC = () => {
    return (
        <div className="kpis-vertical-stack">
            <div className="metric-kpi-card">
                <div className="kpi-card-header">
                    <span>Total Customers</span>
                    <IonIcon icon={notificationsOutline} style={{ cursor: 'pointer' }} />
                </div>
                <div className="kpi-card-body">
                    <span className="kpi-value">11,040</span>
                    <span className="kpi-trend-tag">↑ 14.4%</span>
                </div>
                <span className="kpi-card-footer">Last 7 days</span>
            </div>

            <div className="metric-kpi-card">
                <div className="kpi-card-header">
                    <span>New Customers</span>
                    <IonIcon icon={notificationsOutline} style={{ cursor: 'pointer' }} />
                </div>
                <div className="kpi-card-body">
                    <span className="kpi-value">2,370</span>
                    <span className="kpi-trend-tag">↑ 20%</span>
                </div>
                <span className="kpi-card-footer">Last 7 days</span>
            </div>

            <div className="metric-kpi-card">
                <div className="kpi-card-header">
                    <span>Visitor</span>
                    <IonIcon icon={notificationsOutline} style={{ cursor: 'pointer' }} />
                </div>
                <div className="kpi-card-body">
                    <span className="kpi-value">250k</span>
                    <span className="kpi-trend-tag">↑ 20%</span>
                </div>
                <span className="kpi-card-footer">Last 7 days</span>
            </div>
        </div>
    );
};

export default CustomerKpiCards;
