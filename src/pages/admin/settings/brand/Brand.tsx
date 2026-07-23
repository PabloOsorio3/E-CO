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
    fetchBrands,
    createBrandThunk,
    deleteBrandThunk,
    updateBrandThunk,
} from '../../../../store/slices/brand.slice';
import type { BrandCreate, BrandResponse } from '../../../../interface/brand.interface';

import { PageHeader, LoadingSpinner, EmptyState, ConfirmModal } from '../../../../components/shared';
import BrandModal from './BrandModal';
import { showSuccessAlert } from '../../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../../alerts/error/error-alert';
import { pencilOutline } from 'ionicons/icons';
import '../../../css/settings.css';

const Brand: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { items: brands, loading } = useAppSelector((state) => state.brand);

    const [showModal, setShowModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<BrandResponse | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    // Se incrementa en cada apertura para forzar el remount del modal
    // (así el modal inicializa su estado local desde props sin usar un efecto).
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    const handleOpenCreate = () => {
        setSelectedBrand(null);
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

    const handleOpenEdit = (brand: BrandResponse) => {
        setSelectedBrand(brand);
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

    const handleSave = async (data: BrandCreate) => {
        try {
            if (selectedBrand) {
                await dispatch(updateBrandThunk({ id: selectedBrand.id_brand, data: { ...selectedBrand, ...data } })).unwrap();
                showSuccessAlert('Marca actualizada exitosamente');
            } else {
                await dispatch(createBrandThunk(data)).unwrap();
                showSuccessAlert('Marca creada exitosamente');
            }
            setShowModal(false);
        } catch (error: any) {
            showErrorAlert(error || 'Error al procesar la marca');
        }
    };

    const handleDeleteRequest = (id: number) => {
        setDeletingId(id);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId === null) return;
        try {
            await dispatch(deleteBrandThunk(deletingId)).unwrap();
            showSuccessAlert('Marca eliminada exitosamente');
        } catch (error: any) {
            showErrorAlert(error || 'Error al eliminar la marca');
        }
        setDeletingId(null);
    };

    return (
        <IonPage>
            <PageHeader
                title="Marcas"
                subtitle="Gestionar marcas de productos"
                actionIcon={addOutline}
                onAction={handleOpenCreate}
            />

            <IonContent className="settings-page">
                <div className="settings-list">
                    <IonButton fill="clear" className="settings-back-link" onClick={() => history.push('/admin/settings')}>
                        <IonIcon slot="start" icon={arrowBackOutline} />
                        Volver a Configuración
                    </IonButton>

                    {loading && brands.length === 0 ? (
                        <LoadingSpinner text="Cargando marcas..." />
                    ) : brands.length === 0 ? (
                        <EmptyState
                            icon={fileTrayFull}
                            title="No hay marcas"
                            description="Aún no has creado ninguna marca. ¡Comienza creando una!"
                            actionText="Crear Marca"
                            onAction={handleOpenCreate}
                        />
                    ) : (
                        brands.map((brand) => (
                            <IonCard className="settings-item-card" key={brand.id_brand}>
                                <IonCardHeader>
                                    <div className="settings-item-row">
                                        <div className="settings-item-info">
                                            <div className="settings-item-icon">
                                                <IonIcon icon={fileTrayFull} />
                                            </div>
                                            <IonCardTitle className="settings-item-title">
                                                {brand.brand_name}
                                            </IonCardTitle>
                                        </div>
                                        <div className="settings-item-actions">
                                            <IonButton fill="clear" className="settings-icon-btn edit" onClick={() => handleOpenEdit(brand)}>
                                                <IonIcon icon={pencilOutline} />
                                            </IonButton>
                                            <IonButton fill="clear" className="settings-icon-btn delete" onClick={() => handleDeleteRequest(brand.id_brand)}>
                                                <IonIcon icon={trashOutline} />
                                            </IonButton>
                                        </div>
                                    </div>
                                </IonCardHeader>
                            </IonCard>
                        ))
                    )}
                </div>

                <BrandModal
                    key={modalKey}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    brand={selectedBrand}
                    loading={loading}
                />

                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setDeletingId(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="¿Eliminar marca?"
                    message="Esta acción eliminará la marca permanentemente. Asegúrate de que no haya productos asociados."
                    confirmText="Eliminar"
                    variant="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default Brand;
