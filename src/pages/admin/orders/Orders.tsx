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
    cartOutline,
    eyeOutline,
} from 'ionicons/icons';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchOrdersThunk,
    updateOrderStatusThunk,
} from '../../../store/slices/order.slice';
import type { OrderResponse, OrderStatusUpdate } from '../../../interface/order.interface';

import { PageHeader, LoadingSpinner, EmptyState } from '../../../components/shared';
import OrderModal from './OrderModal';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';

const Orders: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items: orders, loading } = useAppSelector((state) => state.order);

    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    // Se incrementa en cada apertura para forzar el remount del modal
    // (así el modal inicializa su estado local desde props sin usar un efecto).
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
        dispatch(fetchOrdersThunk());
    }, [dispatch]);

    const handleOpenView = (order: OrderResponse) => {
        setSelectedOrder(order);
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

    const handleSaveStatus = async (data: OrderStatusUpdate) => {
        try {
            if (selectedOrder) {
                await dispatch(updateOrderStatusThunk({
                    id: selectedOrder.id_order,
                    data
                })).unwrap();
                showSuccessAlert('Estado de la orden actualizado exitosamente');
            }
            setShowModal(false);
        } catch (error: any) {
            showErrorAlert(error || 'Error al actualizar el estado de la orden');
        }
    };

    return (
        <IonPage>
            <PageHeader
                title="Órdenes"
                subtitle="Gestionar órdenes de clientes"
            />

            <IonContent className="ion-padding">
                {loading && orders.length === 0 ? (
                    <LoadingSpinner text="Cargando órdenes..." />
                ) : orders.length === 0 ? (
                    <EmptyState
                        icon={cartOutline}
                        title="No hay órdenes"
                        description="Aún no se han recibido órdenes."
                    />
                ) : (
                    <IonGrid>
                        <IonRow>
                            {orders.map((order: OrderResponse) => (
                                <IonCol size="12" sizeMd="6" sizeLg="4" key={order.id_order}>
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
                                                        background: 'var(--ion-color-primary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <IonIcon icon={cartOutline} style={{ color: 'white', fontSize: '20px' }} />
                                                    </div>
                                                    <div>
                                                        <IonCardTitle style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                                                            Orden #{order.id_order}
                                                        </IonCardTitle>
                                                        <div style={{ fontSize: '0.9rem', color: 'gray' }}>
                                                            Total: ${order.total_amount}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <IonButton fill="clear" color="primary" onClick={() => handleOpenView(order)}>
                                                        <IonIcon icon={eyeOutline} />
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

                <OrderModal
                    key={modalKey}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveStatus}
                    order={selectedOrder}
                    loading={loading}
                />
            </IonContent>
        </IonPage>
    );
};

export default Orders;
