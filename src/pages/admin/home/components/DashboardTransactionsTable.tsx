import React from 'react';
import type { OrderResponse } from '../../../../interface/order.interface';
import type { StatusResponse } from '../../../../interface/status.interface';

interface DashboardTransactionsTableProps {
  orders: OrderResponse[];
  statuses: StatusResponse[];
  onFilter: () => void;
  onDetails: () => void;
}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const formatOrderDate = (raw: string): string => {
  const date = new Date(raw.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return raw;
  const datePart = date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  const timePart = date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  return `${datePart} | ${timePart}`;
};

const statusVisual = (name: string | undefined) => {
  const lower = (name ?? '').toLowerCase();
  if (lower.includes('pend')) return { className: 'is-pending', label: name ?? 'Pendiente' };
  if (lower.includes('cancel')) return { className: 'is-canceled', label: name ?? 'Cancelado' };
  return { className: 'is-paid', label: name ?? 'Sin estado' };
};

const DashboardTransactionsTable: React.FC<DashboardTransactionsTableProps> = ({
  orders,
  statuses,
  onFilter,
  onDetails,
}) => {
  const rows = [...orders]
    .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
    .slice(0, 5);

  return (
    <div className="home-card home-transactions-card">
      <div className="home-card-title-row">
        <h2>Transaction</h2>
        <button className="home-filter-btn" onClick={onFilter}>Filter</button>
      </div>

      {rows.length === 0 ? (
        <p className="home-empty-hint">Aún no hay órdenes registradas.</p>
      ) : (
        <div className="home-transactions-table">
          <div className="home-transactions-row home-transactions-head">
            <span>No</span>
            <span>Id Customer</span>
            <span>Order Date</span>
            <span>Status</span>
            <span>Amount</span>
          </div>
          {rows.map((order, index) => {
            const status = statuses.find((s) => s.id_status === order.status_id);
            const visual = statusVisual(status?.name);
            return (
              <div className="home-transactions-row" key={order.id_order}>
                <span>{index + 1}.</span>
                <span>#{order.id_order}</span>
                <span>{formatOrderDate(order.order_date)}</span>
                <span className="home-transactions-status">
                  <span className={`home-status-dot ${visual.className}`} />
                  {visual.label}
                </span>
                <span>{currencyFormatter.format(order.total_amount)}</span>
              </div>
            );
          })}
        </div>
      )}

      <button className="home-details-btn home-details-btn--right" onClick={onDetails}>Details</button>
    </div>
  );
};

export default DashboardTransactionsTable;
