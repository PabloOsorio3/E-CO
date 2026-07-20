import React from 'react';
import "../../css/menu.css";
import { clearSession, getCurrentUser } from '../../../core/current_user';
import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuToggle,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import {
    gridOutline,
    cartOutline,
    peopleOutline,
    pricetagOutline,
    cubeOutline,
    cardOutline,
    starOutline,
    addCircleOutline,
    listOutline,
    personOutline,
    personCircleOutline,
    settingsOutline,
    logOutOutline,
    openOutline
} from 'ionicons/icons';

interface AppPage {
    url: string;
    icon: string;
    title: string;
}

interface MenuSection {
    title: string;
    pages: AppPage[];
}

const menuSections: MenuSection[] = [
    {
        title: 'Main menu',
        pages: [
            { title: 'Dashboard', url: '/admin/home', icon: gridOutline },
            { title: 'Order Management', url: '/admin/orders', icon: cartOutline },
            { title: 'Customers', url: '/admin/customers', icon: peopleOutline },
            { title: 'Estados', url: '/admin/settings-status', icon: pricetagOutline },
            { title: 'Categories', url: '/admin/settings-category', icon: cubeOutline },
            { title: 'Transaction', url: '/admin/settings-payments', icon: cardOutline },
            { title: 'Brand', url: '/admin/settings-brands', icon: starOutline },
        ]
    },
    {
        title: 'Product',
        pages: [
            { title: 'Add Products', url: '/admin/settings-subcategory', icon: addCircleOutline }, // subcategory as add product standin or placeholder
            { title: 'Configuración', url: '/admin/settings', icon: settingsOutline },
            { title: 'Product List', url: '/admin/products', icon: listOutline },
        ]
    },
    {
        title: 'Admin',
        pages: [
            { title: 'Admin role', url: '/admin/profile', icon: personOutline },
            { title: 'Control Authority', url: '/admin/settings', icon: settingsOutline },
        ]
    }
];

export const MenuAdmin = () => {
    const location = useLocation();
    const currentUser = getCurrentUser();
    const { items: typeUsers } = useAppSelector((state) => state.typeuser);
    const roleName = typeUsers.find((t) => t.id_type_user === currentUser?.type_user_id)?.name ?? 'Usuario';

    return (
        <IonMenu menuId="admin-menu" contentId="admin-content" type="overlay">
            <IonContent style={{ '--background': 'var(--sidebar-bg)' }} scrollY={false}>
                <div id="admin-list">
                    {/* Top Section: Logo and Title */}
                    <div>
                        <div className="logo-container">
                            <span className="logo-text">E-CO</span>
                        </div>

                        {/* Navigation Groups */}
                        <IonList lines="none" style={{ background: 'transparent', padding: 0 }}>
                            {menuSections.map((section, sIndex) => (
                                <React.Fragment key={sIndex}>
                                    <div className="menu-section-title">{section.title}</div>
                                    {section.pages.map((appPage, pIndex) => (
                                        <IonMenuToggle key={`${sIndex}-${pIndex}`} menu="admin-menu" autoHide={false}>
                                            <IonItem
                                                button
                                                className={location.pathname === appPage.url ? 'selected' : ''}
                                                routerLink={appPage.url}
                                                routerDirection="none"
                                                detail={false}
                                            >
                                                <IonIcon slot="start" icon={appPage.icon} />
                                                <IonLabel>{appPage.title}</IonLabel>
                                            </IonItem>
                                        </IonMenuToggle>
                                    ))}
                                </React.Fragment>
                            ))}
                        </IonList>
                    </div>

                    {/* Bottom Section: Profile Summary and External Link */}
                    <div className="sidebar-footer">
                        {/* Profile Info Card */}
                        <div className="profile-card">
                            <div className="profile-avatar">
                                <IonIcon icon={personCircleOutline} />
                            </div>
                            <div className="profile-info">
                                <span className="profile-name">{roleName}</span>
                                <span className="profile-email">
                                    {currentUser ? `ID de usuario #${currentUser.id_user}` : 'Sesión no disponible'}
                                </span>
                            </div>
                            <div
                                className="logout-btn"
                                title="Cerrar Sesión"
                                onClick={() => {
                                    clearSession();
                                    window.location.href = '/';
                                }}
                            >
                                <IonIcon icon={logOutOutline} style={{ margin: 0 }} />
                            </div>
                        </div>

                        {/* Your Shop Link */}
                        <div
                            className="shop-link-card"
                            onClick={() => {
                                window.open('https://github.com', '_blank');
                            }}
                        >
                            <div className="shop-link-left">
                                <IonIcon icon={gridOutline} style={{ color: 'var(--dealport-green)' }} />
                                <span>Your Shop</span>
                            </div>
                            <IonIcon icon={openOutline} style={{ color: 'var(--text-muted)', fontSize: '14px' }} />
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonMenu>
    );
};
