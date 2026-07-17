import React from 'react';
import { IonIcon } from '@ionic/react';
import {
    copyOutline,
    callOutline,
    locationOutline,
    logoFacebook,
    logoWhatsapp,
    logoTwitter,
    logoLinkedin,
    logoInstagram
} from 'ionicons/icons';
import type { CustomerDetail } from '../customer.mock';

interface CustomerProfileSidebarProps {
    selectedCustomer: CustomerDetail | null;
    onCopyEmail: (email: string) => void;
}

const CustomerProfileSidebar: React.FC<CustomerProfileSidebarProps> = ({ selectedCustomer, onCopyEmail }) => {
    if (!selectedCustomer) {
        return (
            <div className="customer-sidebar-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--dash-text-muted)' }}>
                Selecciona un cliente para ver sus detalles de perfil
            </div>
        );
    }

    return (
        <div className="customer-sidebar-card">
            {/* Sidebar header */}
            <div className="sidebar-profile-header">
                <div className="sidebar-profile-avatar">
                    <img src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                </div>
                <div className="profile-header-details">
                    <h3 className="profile-main-name">{selectedCustomer.name}</h3>
                    <div className="profile-main-email-row">
                        <span>{selectedCustomer.email}</span>
                        <button
                            className="email-copy-btn"
                            title="Copiar correo"
                            onClick={() => onCopyEmail(selectedCustomer.email)}
                        >
                            <IonIcon icon={copyOutline} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Input boxes */}
            <div className="customer-info-inputs-section">
                <div className="sidebar-info-input-box">
                    <IonIcon icon={callOutline} />
                    <span>{selectedCustomer.phone}</span>
                </div>
                <div className="sidebar-info-input-box">
                    <IonIcon icon={locationOutline} />
                    <span>{selectedCustomer.address}</span>
                </div>
            </div>

            {/* Social media connections row */}
            <div className="social-media-circles-row">
                <button className="social-circle-btn"><IonIcon icon={logoFacebook} /></button>
                <button className="social-circle-btn"><IonIcon icon={logoWhatsapp} /></button>
                <button className="social-circle-btn"><IonIcon icon={logoTwitter} /></button>
                <button className="social-circle-btn"><IonIcon icon={logoLinkedin} /></button>
                <button className="social-circle-btn"><IonIcon icon={logoInstagram} /></button>
            </div>

            {/* Customer Activity Log dates */}
            <div className="activity-log-section">
                <h3>Activity</h3>
                <div className="activity-log-line">
                    Registration: <span>{selectedCustomer.registrationDate}</span>
                </div>
                <div className="activity-log-line">
                    Last purchase: <span>{selectedCustomer.lastPurchaseDate}</span>
                </div>
            </div>

            {/* Orders summary overview grid */}
            <div className="order-overview-summary-section">
                <h3>Order overview</h3>
                <div className="order-overview-boxes-grid">
                    <div className="order-overview-stat-box blue">
                        <span className="overview-box-value">{selectedCustomer.totalOrders}</span>
                        <span className="overview-box-label">Total order</span>
                    </div>
                    <div className="order-overview-stat-box green">
                        <span className="overview-box-value">{selectedCustomer.completedOrders}</span>
                        <span className="overview-box-label">Completed</span>
                    </div>
                    <div className="order-overview-stat-box red">
                        <span className="overview-box-value">{selectedCustomer.canceledOrders}</span>
                        <span className="overview-box-label">Canceled</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfileSidebar;
