import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { receiptOutline } from 'ionicons/icons';
import { PageHeader, EmptyState } from '../../../components/shared';
import PaymentMethod from './PaymentMethod';
import '../../css/settings.css';

const Transaction: React.FC = () => {
    return (
        <IonPage>
            <PageHeader
                title="Transacciones"
                subtitle="Métodos de pago e historial de transacciones"
            />
            <IonContent className="settings-page">
                <h2 className="transaction-section-title">Métodos de Pago Aceptados</h2>
                <div className="settings-panel">
                    <PaymentMethod />
                </div>

                <h2 className="transaction-section-title">Historial de Transacciones</h2>
                <div className="settings-panel">
                    <EmptyState
                        icon={receiptOutline}
                        title="Aún no disponible"
                        description="El historial de transacciones depende de un endpoint de backend pendiente (ver HANDOFF_transactions.md). Los pagos ya se registran al procesar una compra, solo falta exponerlos aquí."
                    />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Transaction;
