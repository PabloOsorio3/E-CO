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
    pencilOutline,
    cardOutline,
    arrowBackOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
    fetchPaymentMethods,
    createPaymentMethodThunk,
    updatePaymentMethodThunk,
    deletePaymentMethodThunk,
} from '../../../../store/slices/payment.slice';
import type { PaymentMethodCreate, PaymentMethodResponse } from '../../../../interface/payment.interface';

import { PageHeader, LoadingSpinner, EmptyState, ConfirmModal } from '../../../../components/shared';
import PaymentModal from './PaymentMethodModal';
import { showSuccessAlert } from '../../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../../alerts/error/error-alert';
import '../../../css/settings.css';

const PaymentMethod: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { items: payments, loading } = useAppSelector((state) => state.payment);

    const [showModal, setShowModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethodResponse | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    // Se incrementa en cada apertura para forzar el remount del modal
    // (así el modal inicializa su estado local desde props sin usar un efecto).
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
        dispatch(fetchPaymentMethods());
    }, [dispatch]);

    const handleOpenCreate = () => {
        setSelectedPayment(null);
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

    const handleOpenEdit = (payment: PaymentMethodResponse) => {
        setSelectedPayment(payment);
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

    const handleSave = async (data: PaymentMethodCreate) => {
        try {
            if (selectedPayment) {
                await dispatch(updatePaymentMethodThunk({
                    id: selectedPayment.id_payment_method,
                    data: { ...selectedPayment, ...data }
                })).unwrap();
                showSuccessAlert('Tipo de pago actualizado exitosamente');
            } else {
                await dispatch(createPaymentMethodThunk(data)).unwrap();
                showSuccessAlert('Tipo de pago creado exitosamente');
            }
            setShowModal(false);
        } catch (error: any) {
            showErrorAlert(error || 'Error al procesar el tipo de pago');
        }
    };

    const handleDeleteRequest = (id: number) => {
        setDeletingId(id);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId === null) return;
        try {
            await dispatch(deletePaymentMethodThunk(deletingId)).unwrap();
            showSuccessAlert('Tipo de pago eliminado exitosamente');
        } catch (error: any) {
            showErrorAlert(error || 'Error al eliminar el tipo de pago');
        }
        setDeletingId(null);
        setShowDeleteConfirm(false);
    };

    return (
        <IonPage>
            <PageHeader
                title="Tipos de Pago"
                subtitle="Gestionar métodos de pago aceptados"
                actionIcon={addOutline}
                onAction={handleOpenCreate}
            />

            <IonContent className="settings-page">
                <div className="settings-list">
                    <IonButton fill="clear" className="settings-back-link" onClick={() => history.push('/admin/settings')}>
                        <IonIcon slot="start" icon={arrowBackOutline} />
                        Volver a Configuración
                    </IonButton>

                    {loading && payments.length === 0 ? (
                        <LoadingSpinner text="Cargando tipos de pago..." />
                    ) : payments.length === 0 ? (
                        <EmptyState
                            icon={cardOutline}
                            title="No hay tipos de pago"
                            description="Aún no has creado ningún tipo de pago. ¡Comienza creando uno!"
                            actionText="Crear Tipo de Pago"
                            onAction={handleOpenCreate}
                        />
                    ) : (
                        payments.map((payment: PaymentMethodResponse) => (
                            <IonCard className="settings-item-card" key={payment.id_payment_method}>
                                <IonCardHeader>
                                    <div className="settings-item-row">
                                        <div className="settings-item-info">
                                            <div className="settings-item-icon">
                                                <IonIcon icon={cardOutline} />
                                            </div>
                                            <IonCardTitle className="settings-item-title">
                                                {payment.name}
                                            </IonCardTitle>
                                        </div>
                                        <div className="settings-item-actions">
                                            <IonButton fill="clear" className="settings-icon-btn edit" onClick={() => handleOpenEdit(payment)}>
                                                <IonIcon icon={pencilOutline} />
                                            </IonButton>
                                            <IonButton fill="clear" className="settings-icon-btn delete" onClick={() => handleDeleteRequest(payment.id_payment_method)}>
                                                <IonIcon icon={trashOutline} />
                                            </IonButton>
                                        </div>
                                    </div>
                                </IonCardHeader>
                            </IonCard>
                        ))
                    )}
                </div>

                <PaymentModal
                    key={modalKey}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    payment={selectedPayment}
                    loading={loading}
                />

                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setDeletingId(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="¿Eliminar tipo de pago?"
                    message="Esta acción eliminará el tipo de pago permanentemente."
                    confirmText="Eliminar"
                    variant="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default PaymentMethod;
