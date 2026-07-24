import React, { useState } from 'react';
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
    IonTextarea,
} from '@ionic/react';
import { closeOutline, saveOutline } from 'ionicons/icons';
import type { PaymentMethodCreate, PaymentMethodResponse } from '../../../interface/payment.interface';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PaymentMethodCreate) => void;
    payment?: PaymentMethodResponse | null;
    loading?: boolean;
}

const PaymentMethodModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSave, payment, loading }) => {
    // El componente se remonta (via `key` en el padre) cada vez que se abre,
    // por lo que el estado inicial se calcula una sola vez a partir de `payment`.
    const [name, setName] = useState(() => payment?.name ?? '');
    const [description, setDescription] = useState(() => payment?.description ?? '');

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({ name: name, description });
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

                <IonItem className="admin-input-item">
                    <IonLabel position="stacked">Descripción</IonLabel>
                    <IonTextarea
                        value={description}
                        onIonInput={(e) => setDescription(e.detail.value || '')}
                        placeholder="Ej. Descripción del producto"
                        rows={3}
                    />
                </IonItem>

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

export default PaymentMethodModal;
