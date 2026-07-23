import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
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
    fetchCategory,
    createCategoryThunk,
    deleteCategoryThunk,
} from '../../../../store/slices/category.slice';
import type { CategoryCreate } from '../../../../interface/category.interface';

import { PageHeader, LoadingSpinner, EmptyState, ConfirmModal } from '../../../../components/shared';
import CategoryModal from './CategoryModal';
import { showSuccessAlert } from '../../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../../alerts/error/error-alert';
import '../../../css/settings.css';

const Category: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { items: categories, loading } = useAppSelector((state) => state.category);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    // Se incrementa en cada apertura para forzar el remount del modal
    // (así el modal inicializa su estado local desde props sin usar un efecto).
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
        dispatch(fetchCategory());
    }, [dispatch]);

    const handleOpenCreate = () => {
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

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
                onAction={handleOpenCreate}
            />

            <IonContent className="settings-page">
                <div className="settings-list">
                    <IonButton fill="clear" className="settings-back-link" onClick={() => history.push('/admin/settings')}>
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
                            onAction={handleOpenCreate}
                        />
                    ) : (
                        categories.map((category) => (
                            <IonCard className="settings-item-card" key={category.id_category}>
                                <IonCardHeader>
                                    <div className="settings-item-row">
                                        <div className="settings-item-info">
                                            <div className="settings-item-icon">
                                                <IonIcon icon={fileTrayFull} />
                                            </div>
                                            <IonCardTitle className="settings-item-title">
                                                {category.name}
                                            </IonCardTitle>
                                        </div>
                                        <div className="settings-item-actions">
                                            <IonButton fill="clear" className="settings-icon-btn delete" onClick={() => handleDeleteRequest(category.id_category)}>
                                                <IonIcon icon={trashOutline} />
                                            </IonButton>
                                        </div>
                                    </div>
                                </IonCardHeader>
                            </IonCard>
                        ))
                    )}
                </div>

                <CategoryModal
                    key={modalKey}
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

export default Category;
