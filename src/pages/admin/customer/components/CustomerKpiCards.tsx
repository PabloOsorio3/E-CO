import React from 'react';

interface CustomerKpiCardsProps {
    total: number;
    active: number;
    inactive: number;
}

const CustomerKpiCards: React.FC<CustomerKpiCardsProps> = ({ total, active, inactive }) => {
    return (
        <div className="kpis-vertical-stack">
            <div className="metric-kpi-card">
                <div className="kpi-card-header">
                    <span>Total Clientes</span>
                </div>
                <div className="kpi-card-body">
                    <span className="kpi-value">{total}</span>
                </div>
            </div>

            <div className="metric-kpi-card">
                <div className="kpi-card-header">
                    <span>Activos</span>
                </div>
                <div className="kpi-card-body">
                    <span className="kpi-value">{active}</span>
                </div>
            </div>

            <div className="metric-kpi-card">
                <div className="kpi-card-header">
                    <span>Inactivos</span>
                </div>
                <div className="kpi-card-body">
                    <span className="kpi-value">{inactive}</span>
                </div>
            </div>
        </div>
    );
};

export default CustomerKpiCards;
