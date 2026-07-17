import React, { useEffect, useMemo, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar } from '@ionic/react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCustomersThunk } from '../../../store/slices/customer.slice';
import type { CustomerResponse } from '../../../interface/customer.interface';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';
import { showInfoAlert } from '../../../alerts/info/info-alert';
import { getMockCustomersList, type CustomerDetail } from './customer.mock';
import CustomerTopBar from './components/CustomerTopBar';
import CustomerKpiCards from './components/CustomerKpiCards';
import CustomerOverviewChart from './components/CustomerOverviewChart';
import CustomerTable from './components/CustomerTable';
import CustomerProfileSidebar from './components/CustomerProfileSidebar';
import '../../css/customer.css';

const Customer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { customers, loading } = useAppSelector((state) => state.customer);

    // Dashboard State
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
    // IDs eliminados localmente (la eliminación es solo simulada en UI, no hay DELETE real).
    const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                await dispatch(fetchCustomersThunk()).unwrap();
            } catch (error) {
                showErrorAlert(typeof error === 'string' ? error : 'Error al cargar los clientes');
            }
        };
        loadCustomers();
    }, [dispatch]);

    // Datos de la página actual, derivados de currentPage/searchQuery/customers/removedIds.
    // Se calculan durante el render (no en un efecto) porque son un valor puramente derivado.
    const pageCustomers = useMemo(() => {
        let allCorpus: CustomerDetail[] = [];

        // 1. If backend has customers, convert and prepend them
        if (customers && customers.length > 0) {
            const statuses: ('Active' | 'Inactive' | 'VIP')[] = ['Active', 'Inactive', 'VIP'];
            customers.forEach((c: CustomerResponse, index: number) => {
                const name = c.name || `User ${c.id_customer ?? index}`;
                const email = c.email || `customer${index}@example.com`;
                const phone = c.phone || '+1234567890';
                const status = statuses[index % 3];
                const spend = 150 + (index * 115);
                const orders = 3 + (index % 4) * 8;
                allCorpus.push({
                    id: `#CUST${String(index + 1).padStart(3, '0')}`,
                    name: name,
                    phone: phone,
                    email: email,
                    orderCount: orders,
                    totalSpend: spend.toFixed(2),
                    status: status,
                    address: c.address || `${100 + index} Main St, NY`,
                    registrationDate: '15.01.2025',
                    lastPurchaseDate: '10.01.2025',
                    totalOrders: orders * 4,
                    completedOrders: Math.floor(orders * 3.6),
                    canceledOrders: Math.floor(orders * 0.4),
                    avatar: `https://images.unsplash.com/photo-${1500000000000 + index * 100000}?auto=format&fit=crop&q=80&w=150`
                });
            });
        }

        // 2. Supplement with mock customers to ensure page numbers look full (up to 120 items)
        const currentCount = allCorpus.length;
        if (currentCount < 120) {
            const mockList = getMockCustomersList(120);
            allCorpus = [...allCorpus, ...mockList.slice(currentCount)];
        }

        // 3. Filter by search query if any
        let filtered = allCorpus;
        if (searchQuery.trim() !== '') {
            filtered = allCorpus.filter(c =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 4. Remove locally-deleted customers
        if (removedIds.size > 0) {
            filtered = filtered.filter(c => !removedIds.has(c.id));
        }

        // 5. Paginate (10 per page)
        return filtered.slice((currentPage - 1) * 10, currentPage * 10);
    }, [currentPage, searchQuery, customers, removedIds]);

    // Selecciona el primer cliente de la página por defecto, y mantiene la selección
    // sincronizada si la lista cambia y el cliente seleccionado ya no está presente.
    // Se ajusta durante el render (en vez de en un efecto) siguiendo el patrón de React
    // para derivar estado a partir de cambios de props/estado sin efectos en cascada.
    const [prevPageCustomers, setPrevPageCustomers] = useState(pageCustomers);
    if (pageCustomers !== prevPageCustomers) {
        setPrevPageCustomers(pageCustomers);
        if (!selectedCustomer || !pageCustomers.some(c => c.id === selectedCustomer.id)) {
            setSelectedCustomer(pageCustomers[0] ?? null);
        }
    }

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleCopyEmail = (email: string) => {
        navigator.clipboard.writeText(email);
        showSuccessAlert('Correo copiado al portapapeles');
    };

    const handleOpenChat = (name: string) => {
        showInfoAlert(`Abriendo chat con ${name}...`);
    };

    const handleDeleteCustomer = (id: string, name: string) => {
        showErrorAlert(`Cliente ${name} (${id}) eliminado`);
        setRemovedIds(prev => new Set(prev).add(id));
    };

    return (
        <IonPage className={darkMode ? 'dark-theme' : ''}>
            <IonHeader className="ion-no-border" style={{ background: 'var(--dash-bg)' }}>
                <IonToolbar style={{ '--background': 'var(--dash-bg)', '--border-style': 'none', padding: '16px 24px 8px 24px' }}>
                    <CustomerTopBar
                        darkMode={darkMode}
                        onToggleDarkMode={() => setDarkMode(!darkMode)}
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                    />
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-no-padding">
                <div className="customer-dashboard-container">
                    <div className="dashboard-grid">

                        {/* Left Content Area */}
                        <div className="dashboard-left-column">
                            <div className="analytics-section">
                                <CustomerKpiCards />
                                <CustomerOverviewChart />
                            </div>

                            <CustomerTable
                                loading={loading}
                                pageCustomers={pageCustomers}
                                selectedCustomer={selectedCustomer}
                                onSelectCustomer={setSelectedCustomer}
                                onOpenChat={handleOpenChat}
                                onDeleteCustomer={handleDeleteCustomer}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>

                        {/* Right Content Area (Selected Customer Profile Sidebar) */}
                        <div className="dashboard-right-column">
                            <CustomerProfileSidebar
                                selectedCustomer={selectedCustomer}
                                onCopyEmail={handleCopyEmail}
                            />
                        </div>

                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Customer;
