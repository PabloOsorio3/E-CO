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
    IonSelect,
    IonSelectOption,
} from '@ionic/react';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { useAppSelector } from '../../../../store/hooks';
import type { SubCategoryCreate } from '../../../../interface/subcategory.interface';

interface SubcategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: SubCategoryCreate) => void;
    loading?: boolean;
}

const SubCategoryModal: React.FC<SubcategoryModalProps> = ({ isOpen, onClose, onSave, loading }) => {
    const { items: category } = useAppSelector((state) => state.category);
    // El componente se remonta (via `key` en el padre) cada vez que se abre,
    // por lo que no se necesita un efecto para limpiar los campos.
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const handleSave = () => {
        if (!name.trim() || categoryId === null) return;
        onSave({ name, category_id: categoryId });
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="admin-modal">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Nueva Subcategoría</IonTitle>
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
                        <IonLabel position="stacked">Nombre de la Subcategoría</IonLabel>
                        <IonInput
                            value={name}
                            onIonInput={(e) => setName(e.detail.value || '')}
                            placeholder="Ej. Smartphones"
                        />
                    </IonItem>

                    <IonItem className="admin-input-item">
                        <IonLabel position="stacked">Categoría Padre</IonLabel>
                        <IonSelect
                            value={categoryId}
                            placeholder="Selecciona una categoría"
                            onIonChange={(e) => setCategoryId(e.detail.value)}
                        >
                            {category.map((cat) => (
                                <IonSelectOption key={cat.id_category} value={cat.id_category}>
                                    {cat.name}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                </IonList>

                <div className="ion-padding-top">
                    <IonButton expand="block" onClick={handleSave} disabled={loading || !name.trim() || categoryId === null}>
                        <IonIcon slot="start" icon={saveOutline} />
                        Guardar Subcategoría
                    </IonButton>
                </div>

                <IonLoading isOpen={loading} message="Guardando..." />
            </IonContent>
        </IonModal>
    );
};

export default SubCategoryModal;
