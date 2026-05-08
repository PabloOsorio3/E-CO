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
import type { CategoryCreate } from '../../../../interface/category.interface';
interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CategoryCreate) => void;
    loading?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, loading }) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setName('');
            setSlug('');
        }
    }, [isOpen]);

    const handleSave = () => {
        if (!name.trim() || !slug.trim()) return;
        onSave({ name, slug });
    };

    const handleNameChange = (e: any) => {
        const val = e.detail.value || '';
        setName(val);
        // Auto-generate slug
        setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="admin-modal">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Nueva Categoría</IonTitle>
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
                        <IonLabel position="stacked">Nombre de la Categoría</IonLabel>
                        <IonInput
                            value={name}
                            onIonInput={handleNameChange}
                            placeholder="Ej. Electrónica"
                        />
                    </IonItem>

                    <IonItem className="admin-input-item">
                        <IonLabel position="stacked">Slug (URL)</IonLabel>
                        <IonInput
                            value={slug}
                            onIonInput={(e) => setSlug(e.detail.value || '')}
                            placeholder="ej-electronica"
                        />
                    </IonItem>
                </IonList>

                <div className="ion-padding-top">
                    <IonButton expand="block" onClick={handleSave} disabled={loading || !name.trim()}>
                        <IonIcon slot="start" icon={saveOutline} />
                        Guardar Categoría
                    </IonButton>
                </div>

                <IonLoading isOpen={loading} message="Guardando..." />
            </IonContent>
        </IonModal>
    );
};

export default CategoryModal;
