import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
} from '@ionic/react';
import {
    addOutline,
    trashOutline,
    pencilOutline,
    pricetagOutline,
} from 'ionicons/icons';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchPromotions,
    createPromotionThunk,
    updatePromotionThunk,
    deletePromotionThunk,
} from '../../../store/slices/promotion.slice';
import type { PromotionCreate, PromotionResponse } from '../../../interface/promotion.interface';

import { AdminTopBar, LoadingSpinner, EmptyState, ConfirmModal } from '../../../components/shared';
import PromotionModal from './PromotionModal';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';
import '../../css/settings.css';

const Promotions: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items: promotions, loading } = useAppSelector((state) => state.promotions);

    const [showModal, setShowModal] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<PromotionResponse | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    // Se incrementa en cada apertura para forzar el remount del modal
    // (así el modal inicializa su estado local desde props sin usar un efecto).
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
        dispatch(fetchPromotions());
    }, [dispatch]);

    const handleOpenCreate = () => {
        setSelectedPromotion(null);
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

    const handleOpenEdit = (promotion: PromotionResponse) => {
        setSelectedPromotion(promotion);
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

    const handleSave = async (data: PromotionCreate) => {
        try {
            if (selectedPromotion) {
                await dispatch(updatePromotionThunk({ id: selectedPromotion.id_promotion, data })).unwrap();
                showSuccessAlert('Promoción actualizada exitosamente');
            } else {
                await dispatch(createPromotionThunk(data)).unwrap();
                showSuccessAlert('Promoción creada exitosamente');
            }
            setShowModal(false);
        } catch (error: any) {
            showErrorAlert(error || 'Error al procesar la promoción');
        }
    };

    const handleDeleteRequest = (id: number) => {
        setDeletingId(id);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId === null) return;
        try {
            await dispatch(deletePromotionThunk(deletingId)).unwrap();
            showSuccessAlert('Promoción eliminada exitosamente');
        } catch (error: any) {
            showErrorAlert(error || 'Error al eliminar la promoción');
        }
        setDeletingId(null);
        setShowDeleteConfirm(false);
    };

    return (
        <IonPage>
            <AdminTopBar title="Promociones" />
            <IonContent className="settings-page">
                <div className="settings-panel">
                    <div className="settings-panel-toolbar">
                        <span className="settings-panel-count">
                            {promotions.length} promoción{promotions.length !== 1 ? 'es' : ''}
                        </span>
                        <IonButton className="settings-panel-add-btn" onClick={handleOpenCreate}>
                            <IonIcon slot="start" icon={addOutline} />
                            Nueva Promoción
                        </IonButton>
                    </div>

                    {loading && promotions.length === 0 ? (
                        <LoadingSpinner text="Cargando promociones..." />
                    ) : promotions.length === 0 ? (
                        <EmptyState
                            icon={pricetagOutline}
                            title="No hay promociones"
                            description="Aún no has creado ninguna promoción. ¡Comienza creando una!"
                            actionText="Crear Promoción"
                            onAction={handleOpenCreate}
                        />
                    ) : (
                        promotions.map((promotion) => (
                            <IonCard className="settings-item-card" key={promotion.id_promotion}>
                                <IonCardHeader>
                                    <div className="settings-item-row">
                                        <div className="settings-item-info">
                                            <div
                                                className="settings-item-icon"
                                                style={{ background: promotion.active ? '#4ea674' : '#9ca3af' }}
                                            >
                                                <IonIcon icon={pricetagOutline} />
                                            </div>
                                            <div>
                                                <IonCardTitle className="settings-item-title">
                                                    {promotion.name}
                                                </IonCardTitle>
                                                <span className="settings-item-subtitle">
                                                    {promotion.discount_percentage}% de descuento · {promotion.active ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="settings-item-actions">
                                            <IonButton fill="clear" className="settings-icon-btn edit" onClick={() => handleOpenEdit(promotion)}>
                                                <IonIcon icon={pencilOutline} />
                                            </IonButton>
                                            <IonButton fill="clear" className="settings-icon-btn delete" onClick={() => handleDeleteRequest(promotion.id_promotion)}>
                                                <IonIcon icon={trashOutline} />
                                            </IonButton>
                                        </div>
                                    </div>
                                </IonCardHeader>
                            </IonCard>
                        ))
                    )}
                </div>

                <PromotionModal
                    key={modalKey}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    promotion={selectedPromotion}
                    loading={loading}
                />

                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setDeletingId(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="¿Eliminar promoción?"
                    message="Esta acción eliminará la promoción permanentemente."
                    confirmText="Eliminar"
                    variant="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default Promotions;
