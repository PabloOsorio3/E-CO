import React from 'react';
import { IonIcon } from '@ionic/react';
import {
    copyOutline,
    callOutline,
    locationOutline,
    personCircleOutline,
    logoFacebook,
    logoWhatsapp,
    logoTwitter,
    logoLinkedin,
    logoInstagram
} from 'ionicons/icons';
import type { CustomerResponse } from '../../../../interface/customer.interface';
import StatusBadge from '../../../../components/shared/StatusBadge';

interface CustomerProfileSidebarProps {
    selectedCustomer: CustomerResponse | null;
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

    const displayName = selectedCustomer.name ?? `Usuario #${selectedCustomer.user_id}`;

    return (
        <div className="customer-sidebar-card">
            {/* Sidebar header */}
            <div className="sidebar-profile-header">
                <div className="sidebar-profile-avatar">
                    <IonIcon icon={personCircleOutline} />
                </div>
                <div className="profile-header-details">
                    <h3 className="profile-main-name">{displayName}</h3>
                    <div className="profile-main-email-row">
                        <span>{selectedCustomer.email ?? 'Sin correo registrado'}</span>
                        {selectedCustomer.email && (
                            <button
                                className="email-copy-btn"
                                title="Copiar correo"
                                onClick={() => onCopyEmail(selectedCustomer.email!)}
                            >
                                <IonIcon icon={copyOutline} />
                            </button>
                        )}
                    </div>
                    <StatusBadge statusId={selectedCustomer.status_id} />
                </div>
            </div>

            {/* Info Input boxes */}
            <div className="customer-info-inputs-section">
                <div className="sidebar-info-input-box">
                    <IonIcon icon={callOutline} />
                    <span>{selectedCustomer.phone ?? 'Sin teléfono registrado'}</span>
                </div>
                <div className="sidebar-info-input-box">
                    <IonIcon icon={locationOutline} />
                    <span>{selectedCustomer.address ?? 'Sin dirección registrada'}</span>
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
        </div>
    );
};

export default CustomerProfileSidebar;
