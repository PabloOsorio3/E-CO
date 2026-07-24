import React, { useEffect, useMemo, useState } from 'react';
import {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
} from '@ionic/react';
import {
    cartOutline,
    eyeOutline,
    chevronBackOutline,
    chevronForwardOutline,
} from 'ionicons/icons';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchOrdersThunk,
    updateOrderStatusThunk,
} from '../../../store/slices/order.slice';
import { fetchProducts } from '../../../store/slices/product.slice';
import type { OrderResponse, OrderStatusUpdate } from '../../../interface/order.interface';

import { PageHeader, SearchBar, LoadingSpinner, EmptyState, StatusBadge } from '../../../components/shared';
import OrderModal from './OrderModal';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';

import '../../css/orders.css';

const PAGE_SIZE = 10;
const TOP_STATUS_CARDS = 3;

const Orders: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items: orders, loading } = useAppSelector((state) => state.order);
    const { items: products } = useAppSelector((state) => state.products);
    const { items: statuses } = useAppSelector((state) => state.status);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    // Se incrementa en cada apertura para forzar el remount del modal
    // (así el modal inicializa su estado local desde props sin usar un efecto).
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
        dispatch(fetchOrdersThunk());
    }, [dispatch]);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    const getProductLabel = (order: OrderResponse) => {
        const items = order.order_item ?? [];
        if (items.length === 0) return 'N/A';
        const firstProduct = products.find((p) => p.id_product === items[0].product_id);
        const firstName = firstProduct ? firstProduct.name : `Producto #${items[0].product_id}`;
        return items.length > 1 ? `${firstName} y ${items.length - 1} más` : firstName;
    };

    const statusCounts = useMemo(() => {
        const counts = new Map<number, number>();
        orders.forEach((o) => counts.set(o.status_id, (counts.get(o.status_id) ?? 0) + 1));
        return Array.from(counts.entries())
            .map(([statusId, count]) => ({
                statusId,
                count,
                name: statuses.find((s) => s.id_status === statusId)?.name ?? 'N/A',
            }))
            .sort((a, b) => b.count - a.count);
    }, [orders, statuses]);

    const topStatusCards = statusCounts.slice(0, TOP_STATUS_CARDS);

    const filteredOrders = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return orders.filter((order) => {
            const matchesStatus = statusFilter === 'all' || order.status_id === statusFilter;
            const matchesTerm =
                term === '' ||
                String(order.id_order).includes(term) ||
                getProductLabel(order).toLowerCase().includes(term);
            return matchesStatus && matchesTerm;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orders, statusFilter, searchTerm, products]);

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
    const pageOrders = useMemo(
        () => filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filteredOrders, currentPage]
    );

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (statusId: number | 'all') => {
        setStatusFilter(statusId);
        setCurrentPage(1);
    };

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

            <IonContent className="orders-page">
                {loading && orders.length === 0 ? (
                    <LoadingSpinner text="Cargando órdenes..." />
                ) : orders.length === 0 ? (
                    <EmptyState
                        icon={cartOutline}
                        title="No hay órdenes"
                        description="Aún no se han recibido órdenes."
                    />
                ) : (
                    <>
                        <div className="orders-stat-cards">
                            <div className="orders-stat-card">
                                <span className="orders-stat-title">Total de Órdenes</span>
                                <span className="orders-stat-value">{orders.length}</span>
                            </div>
                            {topStatusCards.map(({ statusId, count, name }) => (
                                <div className="orders-stat-card" key={statusId}>
                                    <span className="orders-stat-title">{name}</span>
                                    <span className="orders-stat-value">{count}</span>
                                </div>
                            ))}
                        </div>

                        <div className="orders-toolbar">
                            <div className="orders-status-tabs">
                                <button
                                    className={`orders-status-tab ${statusFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => handleStatusFilter('all')}
                                >
                                    Todas <span className="orders-status-tab-count">({orders.length})</span>
                                </button>
                                {statusCounts.map(({ statusId, name }) => (
                                    <button
                                        key={statusId}
                                        className={`orders-status-tab ${statusFilter === statusId ? 'active' : ''}`}
                                        onClick={() => handleStatusFilter(statusId)}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>

                            <SearchBar
                                value={searchTerm}
                                onSearch={handleSearch}
                                placeholder="Buscar por ID o producto..."
                            />
                        </div>

                        {filteredOrders.length === 0 ? (
                            <EmptyState
                                icon={cartOutline}
                                title="Sin resultados"
                                description="No se encontraron órdenes para este filtro."
                            />
                        ) : (
                            <div className="orders-table-wrapper">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Orden</th>
                                            <th>Producto</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageOrders.map((order, idx) => (
                                            <tr key={order.id_order}>
                                                <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                                                <td className="order-id-cell">#ORD{String(order.id_order).padStart(4, '0')}</td>
                                                <td>{getProductLabel(order)}</td>
                                                <td>{order.order_date}</td>
                                                <td className="order-total-cell">${order.total_amount}</td>
                                                <td>
                                                    <StatusBadge statusId={order.status_id} />
                                                </td>
                                                <td>
                                                    <IonButton fill="clear" className="order-icon-btn" onClick={() => handleOpenView(order)}>
                                                        <IonIcon icon={eyeOutline} />
                                                    </IonButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="orders-pagination-controls">
                                <button
                                    className="orders-pagination-nav-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                >
                                    <IonIcon icon={chevronBackOutline} />
                                    Previous
                                </button>

                                <div className="orders-pagination-numbers-list">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            className={`orders-pagination-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    className="orders-pagination-nav-btn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                >
                                    Next
                                    <IonIcon icon={chevronForwardOutline} />
                                </button>
                            </div>
                        )}
                    </>
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
