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
    IonSelect,
    IonSelectOption,
    IonList,
    IonIcon,
    IonLoading,
} from '@ionic/react';
import { closeOutline, saveOutline } from 'ionicons/icons';
import type { OrderResponse, OrderStatusUpdate } from '../../../interface/order.interface';
import { useAppSelector } from '../../../store/hooks';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: OrderStatusUpdate) => void;
    order?: OrderResponse | null;
    loading?: boolean;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSave, order, loading }) => {
    // El componente se remonta (via `key` en el padre) cada vez que se abre,
    // por lo que el estado inicial se calcula una sola vez a partir de `order`.
    const [statusId, setStatusId] = useState<number>(() => order?.status_id ?? 0);
    const { items: statuses } = useAppSelector((state) => state.status);

    const handleSave = () => {
        if (!statusId) return;
        onSave({ status_id: statusId });
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="admin-modal">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Detalles de Orden #{order?.id_order}</IonTitle>
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
                        <IonLabel position="stacked">Total</IonLabel>
                        <div>${order?.total_amount}</div>
                    </IonItem>
                    <IonItem className="admin-input-item">
                        <IonLabel position="stacked">Fecha de Orden</IonLabel>
                        <div>{order?.order_date}</div>
                    </IonItem>

                    <IonItem className="admin-input-item" style={{ marginTop: '20px' }}>
                        <IonLabel position="stacked">Actualizar Estado</IonLabel>
                        <IonSelect
                            value={statusId}
                            onIonChange={(e) => setStatusId(e.detail.value)}
                            placeholder="Seleccionar Estado"
                        >
                            {statuses && statuses.map((status: any) => (
                                <IonSelectOption key={status.id_status} value={status.id_status}>
                                    {status.name}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                </IonList>

                <div className="ion-padding-top">
                    <IonButton expand="block" onClick={handleSave} disabled={loading || !statusId}>
                        <IonIcon slot="start" icon={saveOutline} />
                        Actualizar Estado
                    </IonButton>
                </div>
                <IonLoading isOpen={loading} message={'Actualizando...'} />
            </IonContent>
        </IonModal>
    );
};

export default OrderModal;
