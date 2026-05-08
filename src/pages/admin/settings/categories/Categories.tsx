import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
} from '@ionic/react';
import {
    addOutline,
    trashOutline,
    fileTrayFull,
    arrowBackOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
    fetchCategories,
    createCategoryThunk,
    deleteCategoryThunk,
} from '../../../../store/slices/category.slice';
import type { CategoryCreate } from '../../../../interface/category.interface';

import { PageHeader, LoadingSpinner, EmptyState, ConfirmModal } from '../../../../components/shared';
import CategoryModal from './CategoryModal';
import { showSuccessAlert } from '../../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../../alerts/error/error-alert';

const Categories: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { items: categories, loading } = useAppSelector((state) => state.category);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleSave = async (data: CategoryCreate) => {
        try {
            await dispatch(createCategoryThunk(data)).unwrap();
            showSuccessAlert('Categoría creada exitosamente');
            setShowModal(false);
        } catch (error: any) {
            showErrorAlert(error || 'Error al crear la categoría');
        }
    };

    const handleDeleteRequest = (id: number) => {
        setDeletingId(id);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId === null) return;
        try {
            await dispatch(deleteCategoryThunk(deletingId)).unwrap();
            showSuccessAlert('Categoría eliminada exitosamente');
        } catch (error: any) {
            showErrorAlert(error || 'Error al eliminar la categoría');
        }
        setDeletingId(null);
    };

    return (
        <IonPage>
            <PageHeader
                title="Categorías"
                subtitle="Gestionar categorías de productos"
                actionIcon={addOutline}
                onAction={() => setShowModal(true)}
            />

            <IonContent className="ion-padding">
                <IonButton fill="clear" onClick={() => history.push('/admin/settings')} style={{ marginBottom: '10px' }}>
                    <IonIcon slot="start" icon={arrowBackOutline} />
                    Volver a Configuración
                </IonButton>

                {loading && categories.length === 0 ? (
                    <LoadingSpinner text="Cargando categorías..." />
                ) : categories.length === 0 ? (
                    <EmptyState
                        icon={fileTrayFull}
                        title="No hay categorías"
                        description="Aún no has creado ninguna categoría. ¡Comienza creando una!"
                        actionText="Crear Categoría"
                        onAction={() => setShowModal(true)}
                    />
                ) : (
                    <IonGrid>
                        <IonRow>
                            {categories.map((category) => (
                                <IonCol size="12" sizeMd="6" sizeLg="4" key={category.id_category}>
                                    <IonCard style={{
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        margin: '8px 0'
                                    }}>
                                        <IonCardHeader>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <IonCardTitle style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                                                        {category.name}
                                                    </IonCardTitle>
                                                    <IonCardSubtitle style={{ textTransform: 'none' }}>
                                                        Slug: {category.slug}
                                                    </IonCardSubtitle>
                                                </div>
                                                <IonButton fill="clear" color="danger" onClick={() => handleDeleteRequest(category.id_category)}>
                                                    <IonIcon icon={trashOutline} />
                                                </IonButton>
                                            </div>
                                        </IonCardHeader>
                                    </IonCard>
                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>
                )}

                <CategoryModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    loading={loading}
                />

                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setDeletingId(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="¿Eliminar categoría?"
                    message="Esta acción eliminará la categoría permanentemente. Asegúrate de que no haya productos asociados."
                    confirmText="Eliminar"
                    variant="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default Categories;
