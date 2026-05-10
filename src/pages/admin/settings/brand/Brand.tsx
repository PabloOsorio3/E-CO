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

const Brand: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { items: brands, loading } = useAppSelector((state: any) => state.brand);

    const [showModal, setShowModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<BrandResponse | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    const handleOpenCreate = () => {
        setSelectedBrand(null);
        setShowModal(true);
    };

    const handleOpenEdit = (brand: BrandResponse) => {
        setSelectedBrand(brand);
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

            <IonContent className="ion-padding">
                <IonButton fill="clear" onClick={() => history.push('/admin/settings')} style={{ marginBottom: '10px' }}>
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
                    <IonGrid>
                        <IonRow>
                            {brands.map((brand) => (
                                <IonCol size="12" sizeMd="6" sizeLg="4" key={brand.id_brand}>
                                    <IonCard style={{
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        margin: '8px 0'
                                    }}>
                                        <IonCardHeader>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <IonCardTitle style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                                                        {brand.brand_name}
                                                    </IonCardTitle>
                                                </div>
                                                <div>
                                                    <IonButton fill="clear" color="primary" onClick={() => handleOpenEdit(brand)}>
                                                        <IonIcon icon={pencilOutline} />
                                                    </IonButton>
                                                    <IonButton fill="clear" color="danger" onClick={() => handleDeleteRequest(brand.id_brand)}>
                                                        <IonIcon icon={trashOutline} />
                                                    </IonButton>
                                                </div>
                                            </div>
                                        </IonCardHeader>
                                    </IonCard>
                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>
                )}

                <BrandModal
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
