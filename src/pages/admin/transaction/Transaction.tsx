import React, { useEffect } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { receiptOutline } from 'ionicons/icons';
import { AdminTopBar, EmptyState, LoadingSpinner, StatusBadge } from '../../../components/shared';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPaymentsThunk } from '../../../store/slices/payment.slice';
import PaymentMethod from './PaymentMethod';
import '../../css/settings.css';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

const Transaction: React.FC = () => {
    const dispatch = useAppDispatch();
    const { payments, paymentsLoading, items: paymentMethods } = useAppSelector((state) => state.payment);

    useEffect(() => {
        dispatch(fetchPaymentsThunk());
    }, [dispatch]);

    const getMethodName = (methodId: number) =>
        paymentMethods.find((m) => m.id_payment_method === methodId)?.name ?? `Método #${methodId}`;

    return (
        <IonPage>
            <AdminTopBar title="Transacciones" />
            <IonContent className="settings-page">
                <h2 className="transaction-section-title">Métodos de Pago Aceptados</h2>
                <div className="settings-panel">
                    <PaymentMethod />
                </div>

                <h2 className="transaction-section-title">Historial de Transacciones</h2>
                <div className="settings-panel">
                    {paymentsLoading && payments.length === 0 ? (
                        <LoadingSpinner text="Cargando transacciones..." />
                    ) : payments.length === 0 ? (
                        <EmptyState
                            icon={receiptOutline}
                            title="Sin transacciones todavía"
                            description="Los pagos aparecerán acá a medida que los clientes completen compras."
                        />
                    ) : (
                        <div className="payments-table-wrapper">
                            <table className="payments-table">
                                <thead>
                                    <tr>
                                        <th>Orden</th>
                                        <th>Fecha</th>
                                        <th>Monto</th>
                                        <th>Método</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...payments]
                                        .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
                                        .map((payment) => (
                                            <tr key={payment.id_payment}>
                                                <td className="payment-order-cell">#ORD{String(payment.order_id).padStart(4, '0')}</td>
                                                <td>{payment.payment_date}</td>
                                                <td className="payment-amount-cell">{currencyFormatter.format(payment.amount)}</td>
                                                <td>{getMethodName(payment.payment_method_id)}</td>
                                                <td>
                                                    <StatusBadge statusId={payment.status_id} />
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Transaction;
