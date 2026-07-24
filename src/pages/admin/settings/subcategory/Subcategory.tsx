import React, { useEffect, useState } from 'react';
import {
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
} from '@ionic/react';
import {
    addOutline,
    trashOutline,
    fileTrayFull,
} from 'ionicons/icons';

import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
    fetchSubCategory,
    createSubCategoryThunk,
    deleteSubCategoryThunk,
} from '../../../../store/slices/subcategory.slice';
import { fetchCategory } from '../../../../store/slices/category.slice';
import type { SubCategoryCreate } from '../../../../interface/subcategory.interface';

import { LoadingSpinner, EmptyState, ConfirmModal } from '../../../../components/shared';
import SubCategoryModal from './SubcategoryModal';
import { showSuccessAlert } from '../../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../../alerts/error/error-alert';
import '../../../css/settings.css';

const Subcategory: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items: subcategorys, loading } = useAppSelector((state) => state.subcategory);
    const { items: category } = useAppSelector((state) => state.category);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    // Se incrementa en cada apertura para forzar el remount del modal
    // (así el modal inicializa su estado local desde props sin usar un efecto).
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
        dispatch(fetchSubCategory());
        if (category.length === 0) {
            dispatch(fetchCategory());
        }
    }, [dispatch, category.length]);

    const handleOpenCreate = () => {
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

    const handleSave = async (data: SubCategoryCreate) => {
        try {
            await dispatch(createSubCategoryThunk(data)).unwrap();
            showSuccessAlert('Subcategoría creada exitosamente');
            setShowModal(false);
        } catch (error: any) {
            showErrorAlert(error || 'Error al crear la subcategoría');
        }
    };

    const handleDeleteRequest = (id: number) => {
        setDeletingId(id);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId === null) return;
        try {
            await dispatch(deleteSubCategoryThunk(deletingId)).unwrap();
            showSuccessAlert('Subcategoría eliminada exitosamente');
        } catch (error: any) {
            showErrorAlert(error || 'Error al eliminar la subcategoría');
        }
        setDeletingId(null);
        setShowDeleteConfirm(false);
    };

    const getCategoryName = (categoryId: number) => {
        const cat = category.find(cat => cat.id_category === categoryId);
        return cat ? cat.name : 'Categoría desconocida';
    };

    return (
        <div className="settings-panel">
            <div className="settings-panel-toolbar">
                <span className="settings-panel-count">
                    {subcategorys.length} subcategoría{subcategorys.length !== 1 ? 's' : ''}
                </span>
                <IonButton className="settings-panel-add-btn" onClick={handleOpenCreate}>
                    <IonIcon slot="start" icon={addOutline} />
                    Nueva Subcategoría
                </IonButton>
            </div>

            {loading && subcategorys.length === 0 ? (
                <LoadingSpinner text="Cargando subcategorías..." />
            ) : subcategorys.length === 0 ? (
                <EmptyState
                    icon={fileTrayFull}
                    title="No hay subcategorías"
                    description="Aún no has creado ninguna subcategoría. ¡Comienza creando una!"
                    actionText="Crear Subcategoría"
                    onAction={handleOpenCreate}
                />
            ) : (
                subcategorys.map((subcat) => (
                    <IonCard className="settings-item-card" key={subcat.id_subcategory}>
                        <IonCardHeader>
                            <div className="settings-item-row">
                                <div className="settings-item-info">
                                    <div className="settings-item-icon">
                                        <IonIcon icon={fileTrayFull} />
                                    </div>
                                    <div>
                                        <IonCardTitle className="settings-item-title">
                                            {subcat.name}
                                        </IonCardTitle>
                                        <IonCardSubtitle className="settings-item-subtitle">
                                            Categoría: {getCategoryName(subcat.category_id)}
                                        </IonCardSubtitle>
                                    </div>
                                </div>
                                <div className="settings-item-actions">
                                    <IonButton fill="clear" className="settings-icon-btn delete" onClick={() => handleDeleteRequest(subcat.id_subcategory)}>
                                        <IonIcon icon={trashOutline} />
                                    </IonButton>
                                </div>
                            </div>
                        </IonCardHeader>
                    </IonCard>
                ))
            )}

            <SubCategoryModal
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
                title="¿Eliminar subcategoría?"
                message="Esta acción eliminará la subcategoría permanentemente."
                confirmText="Eliminar"
                variant="danger"
            />
        </div>
    );
};

export default Subcategory;
