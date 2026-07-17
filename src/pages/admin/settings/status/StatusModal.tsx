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
import type { StatusCreate, StatusResponse } from '../../../../interface/status.interface';

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: StatusCreate) => void;
    status?: StatusResponse | null;
    loading?: boolean;
}

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, onSave, status, loading }) => {
    // El componente se remonta (via `key` en el padre) cada vez que se abre,
    // por lo que el estado inicial se calcula una sola vez a partir de `status`.
    const [name, setName] = useState(() => status?.name ?? '');

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({ name });
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="admin-modal">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{status ? 'Editar Estado' : 'Nuevo Estado'}</IonTitle>
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
                        <IonLabel position="stacked">Nombre del Estado</IonLabel>
                        <IonInput
                            value={name}
                            onIonInput={(e) => setName(e.detail.value || '')}
                            placeholder="Ej. Disponible"
                        />
                    </IonItem>
                </IonList>

                <div className="ion-padding-top">
                    <IonButton expand="block" onClick={handleSave} disabled={loading || !name.trim()}>
                        <IonIcon slot="start" icon={saveOutline} />
                        {status ? 'Actualizar' : 'Guardar'}
                    </IonButton>
                </div>

                <IonLoading isOpen={loading} message={status ? 'Actualizando...' : 'Guardando...'} />
            </IonContent>
        </IonModal>
    );
};

export default StatusModal;
