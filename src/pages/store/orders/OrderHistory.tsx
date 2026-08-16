import React, { useEffect } from 'react';
import { receiptOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMyOrdersThunk } from '../../../store/slices/order.slice';
import { LoadingSpinner, EmptyState, StatusBadge } from '../../../components/shared';
import StorePageHeader from '../components/StorePageHeader';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

const OrderHistory: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { myOrders, myOrdersLoading } = useAppSelector((state) => state.order);
    const { items: products } = useAppSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchMyOrdersThunk());
    }, [dispatch]);

    const getItemsSummary = (orderItems: { product_id: number; quantity: number }[]) => {
        if (orderItems.length === 0) return 'Sin productos';
        const firstProduct = products.find((p) => p.id_product === orderItems[0].product_id);
        const firstName = firstProduct ? firstProduct.name : `Producto #${orderItems[0].product_id}`;
        return orderItems.length > 1 ? `${firstName} y ${orderItems.length - 1} más` : firstName;
    };

    if (myOrdersLoading && myOrders.length === 0) {
        return (
            <div className="store-page">
                <LoadingSpinner text="Cargando tus pedidos..." />
            </div>
        );
    }

    return (
        <div className="store-page">
            <StorePageHeader title="Mis Pedidos" backTo="/store/catalog" backLabel="Seguir comprando" />

            {myOrders.length === 0 ? (
                <EmptyState
                    icon={receiptOutline}
                    title="Todavía no hiciste ningún pedido"
                    description="Cuando completes una compra, la vas a ver acá."
                    actionText="Ir al catálogo"
                    onAction={() => history.push('/store/catalog')}
                />
            ) : (
                <div className="store-cart-items">
                    <div className="store-cart-items-header">
                        <span>{myOrders.length} pedido{myOrders.length !== 1 ? 's' : ''}</span>
                    </div>
                    {myOrders.map((order) => (
                        <div className="store-order-row" key={order.id_order}>
                            <div className="store-order-row-info">
                                <span className="store-order-id">#ORD{String(order.id_order).padStart(4, '0')}</span>
                                <span className="store-order-items-summary">{getItemsSummary(order.order_item)}</span>
                                <span className="store-order-date">{order.order_date}</span>
                            </div>
                            <StatusBadge statusId={order.status_id} />
                            <span className="store-order-total">{currencyFormatter.format(order.total_amount)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
