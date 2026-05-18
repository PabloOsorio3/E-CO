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

const PaymentMethod: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { items: payments, loading } = useAppSelector((state: any) => state.payment);

    const [showModal, setShowModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethodResponse | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchPaymentMethods());
    }, [dispatch]);

    const handleOpenCreate = () => {
        setSelectedPayment(null);
        setShowModal(true);
    };

    const handleOpenEdit = (payment: PaymentMethodResponse) => {
        setSelectedPayment(payment);
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

            <IonContent className="ion-padding">
                <IonButton fill="clear" onClick={() => history.push('/admin/settings')} style={{ marginBottom: '10px' }}>
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
                    <IonGrid>
                        <IonRow>
                            {payments.map((payment: PaymentMethodResponse) => (
                                <IonCol size="12" sizeMd="6" sizeLg="4" key={payment.id_payment_method}>
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
                                                        background: 'var(--ion-color-warning)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <IonIcon icon={cardOutline} style={{ color: 'white', fontSize: '20px' }} />
                                                    </div>
                                                    <IonCardTitle style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                                                        {payment.name}
                                                    </IonCardTitle>
                                                </div>
                                                <div>
                                                    <IonButton fill="clear" color="primary" onClick={() => handleOpenEdit(payment)}>
                                                        <IonIcon icon={pencilOutline} />
                                                    </IonButton>
                                                    <IonButton fill="clear" color="danger" onClick={() => handleDeleteRequest(payment.id_payment_method)}>
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

                <PaymentModal
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
