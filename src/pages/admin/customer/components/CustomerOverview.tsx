import React, { useMemo } from 'react';
import { useAppSelector } from '../../../../store/hooks';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

const CustomerOverview: React.FC = () => {
    const { customers } = useAppSelector((state) => state.customer);
    const { items: orders } = useAppSelector((state) => state.order);

    const topCustomers = useMemo(() => {
        const spendByUser = new Map<number, number>();
        orders.forEach((order) => {
            spendByUser.set(order.user_id, (spendByUser.get(order.user_id) ?? 0) + order.total_amount);
        });

        return customers
            .map((customer) => ({
                customer,
                spend: spendByUser.get(customer.user_id) ?? 0,
            }))
            .filter((entry) => entry.spend > 0)
            .sort((a, b) => b.spend - a.spend)
            .slice(0, 5);
    }, [customers, orders]);

    return (
        <div className="customer-overview-card">
            <div className="customer-overview-header">
                <h2>Customer Overview</h2>
                <span>Top clientes por gasto total</span>
            </div>

            {topCustomers.length === 0 ? (
                <p className="customer-overview-empty">Aún no hay órdenes registradas.</p>
            ) : (
                <div className="customer-overview-list">
                    {topCustomers.map(({ customer, spend }, index) => (
                        <div className="customer-overview-row" key={customer.id_customer}>
                            <span className="customer-overview-rank">{index + 1}</span>
                            <span className="customer-overview-name">
                                {customer.name ?? `Usuario #${customer.user_id}`}
                            </span>
                            <span className="customer-overview-spend">{currencyFormatter.format(spend)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerOverview;
