import React from 'react';
import { IonIcon, IonButton } from '@ionic/react';
import { chatboxEllipsesOutline, createOutline, addOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import type { CustomerResponse } from '../../../../interface/customer.interface';
import StatusBadge from '../../../../components/shared/StatusBadge';

interface CustomerTableProps {
    loading: boolean;
    pageCustomers: CustomerResponse[];
    selectedCustomer: CustomerResponse | null;
    onSelectCustomer: (customer: CustomerResponse) => void;
    onOpenChat: (name: string) => void;
    onEditCustomer: (customer: CustomerResponse) => void;
    onCreateCustomer: () => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
    loading,
    pageCustomers,
    selectedCustomer,
    onSelectCustomer,
    onOpenChat,
    onEditCustomer,
    onCreateCustomer,
    currentPage,
    totalPages,
    onPageChange
}) => {
    return (
        <div className="customer-details-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Customer Details</h2>
                <IonButton size="small" onClick={onCreateCustomer}>
                    <IonIcon icon={addOutline} slot="start" />
                    Nuevo Cliente
                </IonButton>
            </div>

            <div className="responsive-table-container">
                <table className="premium-dashboard-table">
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                                    Cargando clientes...
                                </td>
                            </tr>
                        ) : pageCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                                    No se encontraron clientes.
                                </td>
                            </tr>
                        ) : (
                            pageCustomers.map((cust) => {
                                const displayName = cust.name ?? `Usuario #${cust.user_id}`;
                                return (
                                    <tr
                                        key={cust.id_customer}
                                        className={selectedCustomer?.id_customer === cust.id_customer ? 'selected-row' : ''}
                                        onClick={() => onSelectCustomer(cust)}
                                    >
                                        <td className="cust-id-col">#{cust.id_customer}</td>
                                        <td className="cust-name-col">{displayName}</td>
                                        <td>{cust.email ?? '—'}</td>
                                        <td>{cust.phone ?? '—'}</td>
                                        <td>
                                            <StatusBadge statusId={cust.status_id} />
                                        </td>
                                        <td className="table-action-cell" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="action-icon-button"
                                                title="Mensaje"
                                                onClick={() => onOpenChat(displayName)}
                                            >
                                                <IonIcon icon={chatboxEllipsesOutline} />
                                            </button>
                                            <button
                                                className="action-icon-button"
                                                title="Editar"
                                                onClick={() => onEditCustomer(cust)}
                                            >
                                                <IonIcon icon={createOutline} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Table Pagination controls */}
            {totalPages > 1 && (
                <div className="table-pagination-controls">
                    <button
                        className="pagination-nav-btn"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    >
                        <IonIcon icon={chevronBackOutline} />
                        Previous
                    </button>

                    <div className="pagination-numbers-list">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                className={`pagination-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                                onClick={() => onPageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>

                    <button
                        className="pagination-nav-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    >
                        Next
                        <IonIcon icon={chevronForwardOutline} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomerTable;
