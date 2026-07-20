import React, { useEffect, useMemo, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar } from '@ionic/react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchCustomersThunk,
    createCustomerThunk,
    updateCustomerThunk,
} from '../../../store/slices/customer.slice';
import { fetchAllUsersThunk } from '../../../store/slices/user.slice';
import type { CustomerCreate, CustomerResponse, CustomerUpdate } from '../../../interface/customer.interface';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';
import { showInfoAlert } from '../../../alerts/info/info-alert';
import CustomerTopBar from './components/CustomerTopBar';
import CustomerKpiCards from './components/CustomerKpiCards';
import CustomerTable from './components/CustomerTable';
import CustomerProfileSidebar from './components/CustomerProfileSidebar';
import CustomerModal from './CustomerModal';
import { PlaceholderCard } from '../../../components/shared';
import '../../css/customer.css';

const PAGE_SIZE = 10;
const CUSTOMER_TYPE_USER_ID = 2; // st_type_user: 1=Administrador, 2=Cliente

const Customer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { customers, loading } = useAppSelector((state) => state.customer);
    const { items: users } = useAppSelector((state) => state.users);

    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null);
    // Se incrementa en cada apertura para forzar el remount del modal
    // (así el modal inicializa su estado local desde props sin usar un efecto).
    const [modalKey, setModalKey] = useState(0);

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

    const filteredCustomers = useMemo(() => {
        if (searchQuery.trim() === '') return customers;
        const term = searchQuery.toLowerCase();
        return customers.filter((c) =>
            (c.name ?? '').toLowerCase().includes(term) ||
            (c.email ?? '').toLowerCase().includes(term) ||
            (c.phone ?? '').toLowerCase().includes(term) ||
            String(c.id_customer).includes(term)
        );
    }, [customers, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
    const pageCustomers = useMemo(
        () => filteredCustomers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filteredCustomers, currentPage]
    );

    // Selecciona el primer cliente de la página por defecto, y mantiene la selección
    // sincronizada si la lista cambia y el cliente seleccionado ya no está presente.
    const [prevPageCustomers, setPrevPageCustomers] = useState(pageCustomers);
    if (pageCustomers !== prevPageCustomers) {
        setPrevPageCustomers(pageCustomers);
        if (!selectedCustomer || !pageCustomers.some(c => c.id_customer === selectedCustomer.id_customer)) {
            setSelectedCustomer(pageCustomers[0] ?? null);
        }
    }

    const kpis = useMemo(() => {
        const total = customers.length;
        const inactive = customers.filter(c => (c.status ?? '').toLowerCase().includes('inactiv')).length;
        return { total, active: total - inactive, inactive };
    }, [customers]);

    const eligibleUsers = useMemo(() => {
        const linkedUserIds = new Set(customers.map(c => c.user_id));
        return users.filter(u => u.type_user_id === CUSTOMER_TYPE_USER_ID && !linkedUserIds.has(u.id_user));
    }, [users, customers]);

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

    const handleOpenCreate = () => {
        setEditingCustomer(null);
        setModalKey((k) => k + 1);
        setShowModal(true);
        dispatch(fetchAllUsersThunk());
    };

    const handleOpenEdit = (customer: CustomerResponse) => {
        setEditingCustomer(customer);
        setModalKey((k) => k + 1);
        setShowModal(true);
    };

    const handleSaveCreate = async (data: CustomerCreate) => {
        try {
            await dispatch(createCustomerThunk(data)).unwrap();
            showSuccessAlert('Cliente creado exitosamente');
            setShowModal(false);
        } catch (error) {
            showErrorAlert(typeof error === 'string' ? error : 'Error al crear el cliente');
        }
    };

    const handleSaveEdit = async (data: CustomerUpdate) => {
        if (!editingCustomer) return;
        try {
            await dispatch(updateCustomerThunk({ id: editingCustomer.id_customer, data })).unwrap();
            showSuccessAlert('Cliente actualizado exitosamente');
            setShowModal(false);
        } catch (error) {
            showErrorAlert(typeof error === 'string' ? error : 'Error al actualizar el cliente');
        }
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
                            <CustomerKpiCards total={kpis.total} active={kpis.active} inactive={kpis.inactive} />

                            <PlaceholderCard title="Customer Overview" />

                            <CustomerTable
                                loading={loading}
                                pageCustomers={pageCustomers}
                                selectedCustomer={selectedCustomer}
                                onSelectCustomer={setSelectedCustomer}
                                onOpenChat={handleOpenChat}
                                onEditCustomer={handleOpenEdit}
                                onCreateCustomer={handleOpenCreate}
                                currentPage={currentPage}
                                totalPages={totalPages}
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

            <CustomerModal
                key={modalKey}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSaveCreate={handleSaveCreate}
                onSaveEdit={handleSaveEdit}
                customer={editingCustomer}
                eligibleUsers={eligibleUsers}
                loading={loading}
            />
        </IonPage>
    );
};

export default Customer;
