import React from 'react';
import { IonIcon } from '@ionic/react';
import { chatboxEllipsesOutline, trashOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import type { CustomerDetail } from '../customer.mock';

interface CustomerTableProps {
    loading: boolean;
    pageCustomers: CustomerDetail[];
    selectedCustomer: CustomerDetail | null;
    onSelectCustomer: (customer: CustomerDetail) => void;
    onOpenChat: (name: string) => void;
    onDeleteCustomer: (id: string, name: string) => void;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
    loading,
    pageCustomers,
    selectedCustomer,
    onSelectCustomer,
    onOpenChat,
    onDeleteCustomer,
    currentPage,
    onPageChange
}) => {
    return (
        <div className="customer-details-card">
            <h2>Customer Details</h2>

            <div className="responsive-table-container">
                <table className="premium-dashboard-table">
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Order Count</th>
                            <th>Total Spend</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                                    Cargando clientes...
                                </td>
                            </tr>
                        ) : pageCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                                    No se encontraron clientes.
                                </td>
                            </tr>
                        ) : (
                            pageCustomers.map((cust) => (
                                <tr
                                    key={cust.id}
                                    className={selectedCustomer?.id === cust.id ? 'selected-row' : ''}
                                    onClick={() => onSelectCustomer(cust)}
                                >
                                    <td className="cust-id-col">{cust.id}</td>
                                    <td className="cust-name-col">{cust.name}</td>
                                    <td>{cust.phone}</td>
                                    <td>{cust.orderCount}</td>
                                    <td>${cust.totalSpend}</td>
                                    <td>
                                        <span className={`cust-status-badge ${cust.status.toLowerCase()}`}>
                                            <span className="badge-status-dot"></span>
                                            {cust.status}
                                        </span>
                                    </td>
                                    <td className="table-action-cell" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="action-icon-button"
                                            title="Mensaje"
                                            onClick={() => onOpenChat(cust.name)}
                                        >
                                            <IonIcon icon={chatboxEllipsesOutline} />
                                        </button>
                                        <button
                                            className="action-icon-button delete"
                                            title="Eliminar"
                                            onClick={() => onDeleteCustomer(cust.id, cust.name)}
                                        >
                                            <IonIcon icon={trashOutline} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Table Pagination controls */}
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
                    {[1, 2, 3, 4, 5].map((pageNum) => (
                        <button
                            key={pageNum}
                            className={`pagination-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                            onClick={() => onPageChange(pageNum)}
                        >
                            {pageNum}
                        </button>
                    ))}
                    <span className="pagination-ellipsis">.....</span>
                    <button
                        className={`pagination-num-btn ${currentPage === 24 ? 'active' : ''}`}
                        onClick={() => onPageChange(24)}
                    >
                        24
                    </button>
                </div>

                <button
                    className="pagination-nav-btn"
                    disabled={currentPage === 24}
                    onClick={() => onPageChange(Math.min(currentPage + 1, 24))}
                >
                    Next
                    <IonIcon icon={chevronForwardOutline} />
                </button>
            </div>
        </div>
    );
};

export default CustomerTable;
