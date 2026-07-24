import React, { useEffect, useState } from 'react';
import {
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
    gridOutline,
} from 'ionicons/icons';

import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
    fetchStatus,
    createStatusThunk,
    updateStatusThunk,
    deleteStatusThunk,
} from '../../../../store/slices/status.slice';
import type { StatusCreate, StatusResponse } from '../../../../interface/status.interface';

import { LoadingSpinner, EmptyState, ConfirmModal } from '../../../../components/shared';
import StatusModal from './StatusModal';
import { showSuccessAlert } from '../../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../../alerts/error/error-alert';
import '../../../css/settings.css';

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
        <div className="settings-panel">
            <div className="settings-panel-toolbar">
                <span className="settings-panel-count">
                    {statuses.length} estado{statuses.length !== 1 ? 's' : ''}
                </span>
                <IonButton className="settings-panel-add-btn" onClick={handleOpenCreate}>
                    <IonIcon slot="start" icon={addOutline} />
                    Nuevo Estado
                </IonButton>
            </div>

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
                statuses.map((status: StatusResponse) => (
                    <IonCard className="settings-item-card" key={status.id_status}>
                        <IonCardHeader>
                            <div className="settings-item-row">
                                <div className="settings-item-info">
                                    <div className="settings-item-icon" style={{ background: getStatusColor(status.name) }}>
                                        <IonIcon icon={gridOutline} />
                                    </div>
                                    <IonCardTitle className="settings-item-title">
                                        {status.name}
                                    </IonCardTitle>
                                </div>
                                <div className="settings-item-actions">
                                    <IonButton fill="clear" className="settings-icon-btn edit" onClick={() => handleOpenEdit(status)}>
                                        <IonIcon icon={pencilOutline} />
                                    </IonButton>
                                    <IonButton fill="clear" className="settings-icon-btn delete" onClick={() => handleDeleteRequest(status.id_status)}>
                                        <IonIcon icon={trashOutline} />
                                    </IonButton>
                                </div>
                            </div>
                        </IonCardHeader>
                    </IonCard>
                ))
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
        </div>
    );
};

export default StatusPage;
