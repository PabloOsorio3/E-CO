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
} from '@ionic/react';
import {
    addOutline,
    trashOutline,
    pencilOutline,
    gridOutline,
    arrowBackOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
    fetchStatus,
    createStatusThunk,
    updateStatusThunk,
    deleteStatusThunk,
} from '../../../../store/slices/status.slice';
import type { StatusCreate, StatusResponse } from '../../../../interface/status.interface';

import { PageHeader, LoadingSpinner, EmptyState, ConfirmModal } from '../../../../components/shared';
import StatusModal from './StatusModal';
import { showSuccessAlert } from '../../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../../alerts/error/error-alert';

const STATUS_COLORS: Record<string, string> = {
    'disponible': '#2dd36f',
    'agotado': '#eb445a',
    'oferta': '#ffc409',
    'nuevo': '#3dc2ff',
};

const getStatusColor = (name: string) => {
    const key = name.toLowerCase();
    for (const [k, v] of Object.entries(STATUS_COLORS)) {
        if (key.includes(k)) return v;
    }
    return 'var(--ion-color-success)';
};

const StatusPage: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { items: statuses, loading } = useAppSelector((state) => state.status);

    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<StatusResponse | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    // Se incrementa en cada apertura para forzar el remount del modal
    // (así el modal inicializa su estado local desde props sin usar un efecto).
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
        dispatch(fetchStatus());
    }, [dispatch]);

    const handleOpenCreate = () => {
        setSelectedStatus(null);
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

    const handleOpenEdit = (status: StatusResponse) => {
        setSelectedStatus(status);
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

    const handleSave = async (data: StatusCreate) => {
        try {
            if (selectedStatus) {
                await dispatch(updateStatusThunk({
                    id: selectedStatus.id_status,
                    data: { ...selectedStatus, ...data }
                })).unwrap();
                showSuccessAlert('Estado actualizado exitosamente');
            } else {
                await dispatch(createStatusThunk(data)).unwrap();
                showSuccessAlert('Estado creado exitosamente');
            }
            setShowModal(false);
        } catch (error: any) {
            showErrorAlert(error || 'Error al procesar el estado');
        }
    };

    const handleDeleteRequest = (id: number) => {
        setDeletingId(id);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId === null) return;
        try {
            await dispatch(deleteStatusThunk(deletingId)).unwrap();
            showSuccessAlert('Estado eliminado exitosamente');
        } catch (error: any) {
            showErrorAlert(error || 'Error al eliminar el estado');
        }
        setDeletingId(null);
        setShowDeleteConfirm(false);
    };

    return (
        <IonPage>
            <PageHeader
                title="Estados"
                subtitle="Gestionar estados de productos"
                actionIcon={addOutline}
                onAction={handleOpenCreate}
            />

            <IonContent className="ion-padding">
                <IonButton fill="clear" onClick={() => history.push('/admin/settings')} style={{ marginBottom: '10px' }}>
                    <IonIcon slot="start" icon={arrowBackOutline} />
                    Volver a Configuración
                </IonButton>

                {loading && statuses.length === 0 ? (
                    <LoadingSpinner text="Cargando estados..." />
                ) : statuses.length === 0 ? (
                    <EmptyState
                        icon={gridOutline}
                        title="No hay estados"
                        description="Aún no has creado ningún estado. ¡Comienza creando uno!"
                        actionText="Crear Estado"
                        onAction={handleOpenCreate}
                    />
                ) : (
                    <IonGrid>
                        <IonRow>
                            {statuses.map((status: StatusResponse) => (
                                <IonCol size="12" sizeMd="6" sizeLg="4" key={status.id_status}>
                                    <IonCard style={{
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        margin: '8px 0'
                                    }}>
                                        <IonCardHeader>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '10px',
                                                        background: getStatusColor(status.name),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <IonIcon icon={gridOutline} style={{ color: 'white', fontSize: '20px' }} />
                                                    </div>
                                                    <IonCardTitle style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                                                        {status.name}
                                                    </IonCardTitle>
                                                </div>
                                                <div>
                                                    <IonButton fill="clear" color="primary" onClick={() => handleOpenEdit(status)}>
                                                        <IonIcon icon={pencilOutline} />
                                                    </IonButton>
                                                    <IonButton fill="clear" color="danger" onClick={() => handleDeleteRequest(status.id_status)}>
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

                <StatusModal
                    key={modalKey}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    status={selectedStatus}
                    loading={loading}
                />

                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setDeletingId(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="¿Eliminar estado?"
                    message="Esta acción eliminará el estado permanentemente. Asegúrate de que no haya productos asociados."
                    confirmText="Eliminar"
                    variant="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default StatusPage;
