import React, { useEffect, useState } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonIcon,
    IonLoading,
} from '@ionic/react';
import { closeOutline, saveOutline } from 'ionicons/icons';
import type { PaymentCreate, PaymentResponse } from '../../../../interface/payment.interface';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PaymentCreate) => void;
    payment?: PaymentResponse | null;
    loading?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSave, payment, loading }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen && payment) {
            setName(payment.payment_name);
        } else if (!isOpen) {
            setName('');
        }
    }, [isOpen, payment]);

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({ payment_name: name });
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="admin-modal">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{payment ? 'Editar Tipo de Pago' : 'Nuevo Tipo de Pago'}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>
                            <IonIcon icon={closeOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList lines="none">
                    <IonItem className="admin-input-item">
                        <IonLabel position="stacked">Nombre del Tipo de Pago</IonLabel>
                        <IonInput
                            value={name}
                            onIonInput={(e) => setName(e.detail.value || '')}
                            placeholder="Ej. Tarjeta de Crédito"
                        />
                    </IonItem>
                </IonList>

                <div className="ion-padding-top">
                    <IonButton expand="block" onClick={handleSave} disabled={loading || !name.trim()}>
                        <IonIcon slot="start" icon={saveOutline} />
                        {payment ? 'Actualizar' : 'Guardar'}
                    </IonButton>
                </div>

                <IonLoading isOpen={loading} message={payment ? 'Actualizando...' : 'Guardando...'} />
            </IonContent>
        </IonModal>
    );
};

export default PaymentModal;
