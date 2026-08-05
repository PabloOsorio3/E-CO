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
    IonToggle,
    IonList,
    IonIcon,
    IonLoading,
} from '@ionic/react';
import { closeOutline, saveOutline } from 'ionicons/icons';
import type { PromotionCreate, PromotionResponse } from '../../../interface/promotion.interface';

interface PromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PromotionCreate) => void;
    promotion?: PromotionResponse | null;
    loading?: boolean;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ isOpen, onClose, onSave, promotion, loading }) => {
    // El componente se remonta (via `key` en el padre) cada vez que se abre,
    // por lo que el estado inicial se calcula una sola vez a partir de `promotion`.
    const [name, setName] = useState(() => promotion?.name ?? '');
    const [discountPercentage, setDiscountPercentage] = useState(() => promotion?.discount_percentage ?? 0);
    const [active, setActive] = useState(() => promotion?.active ?? true);

    const isValid = name.trim().length > 0 && discountPercentage > 0 && discountPercentage <= 100;

    const handleSave = () => {
        if (!isValid) return;
        onSave({ name, discount_percentage: discountPercentage, active });
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="admin-modal">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{promotion ? 'Editar Promoción' : 'Nueva Promoción'}</IonTitle>
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
                        <IonLabel position="stacked">Nombre</IonLabel>
                        <IonInput
                            value={name}
                            onIonInput={(e) => setName(e.detail.value || '')}
                            placeholder="Ej. Descuento de Verano"
                        />
                    </IonItem>

                    <IonItem className="admin-input-item">
                        <IonLabel position="stacked">Descuento (%)</IonLabel>
                        <IonInput
                            type="number"
                            min="1"
                            max="100"
                            value={discountPercentage}
                            onIonInput={(e) => setDiscountPercentage(Number(e.detail.value) || 0)}
                            placeholder="Ej. 20"
                        />
                    </IonItem>

                    <IonItem className="admin-input-item" lines="none">
                        <IonLabel>Activa</IonLabel>
                        <IonToggle
                            checked={active}
                            onIonChange={(e) => setActive(e.detail.checked)}
                            slot="end"
                        />
                    </IonItem>
                </IonList>

                <div className="ion-padding-top">
                    <IonButton expand="block" onClick={handleSave} disabled={loading || !isValid}>
                        <IonIcon slot="start" icon={saveOutline} />
                        {promotion ? 'Actualizar Promoción' : 'Guardar Promoción'}
                    </IonButton>
                </div>

                <IonLoading isOpen={loading} message={promotion ? 'Actualizando...' : 'Guardando...'} />
            </IonContent>
        </IonModal>
    );
};

export default PromotionModal;
