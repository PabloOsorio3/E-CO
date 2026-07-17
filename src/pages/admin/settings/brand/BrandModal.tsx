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
} from '@ionic/react';
import { closeOutline, saveOutline } from 'ionicons/icons';
import type { BrandCreate, BrandResponse } from '../../../../interface/brand.interface';
interface BrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: BrandCreate) => void;
    brand?: BrandResponse | null;
    loading?: boolean;
}

const BrandModal: React.FC<BrandModalProps> = ({ isOpen, onClose, onSave, brand, loading }) => {
    // El componente se remonta (via `key` en el padre) cada vez que se abre,
    // por lo que el estado inicial se calcula una sola vez a partir de `brand`.
    const [name, setName] = useState(() => brand?.brand_name ?? '');

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({ brand_name: name });
    };

    const handleNameChange = (e: any) => {
        const val = e.detail.value || '';
        setName(val);
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="admin-modal">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{brand ? 'Editar Marca' : 'Nueva Marca'}</IonTitle>
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
                        <IonLabel position="stacked">Nombre de la Marca</IonLabel>
                        <IonInput
                            value={name}
                            onIonInput={handleNameChange}
                            placeholder="Ej. Samsung"
                        />
                    </IonItem>

                </IonList>

                <div className="ion-padding-top">
                    <IonButton expand="block" onClick={handleSave} disabled={loading || !name.trim()}>
                        <IonIcon slot="start" icon={saveOutline} />
                        {brand ? 'Actualizar Marca' : 'Guardar Marca'}
                    </IonButton>
                </div>

                <IonLoading isOpen={loading} message={brand ? 'Actualizando...' : 'Guardando...'} />
            </IonContent>
        </IonModal>
    );
};

export default BrandModal;