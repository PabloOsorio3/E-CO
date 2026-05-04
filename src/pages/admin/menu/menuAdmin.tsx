import "../../css/menu.css"
import { clearSession } from '../../../core/current_user';
import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
    gridOutline, cubeOutline, cartOutline,
    peopleOutline, pricetagOutline, settingsOutline, logOutOutline
} from 'ionicons/icons';

interface AppPage {
    url: string;
    icon: string;
    title: string;
}

const appPages: AppPage[] = [
    { title: 'Dashboard', url: '/admin/home', icon: gridOutline },
    { title: 'Productos', url: '/admin/products', icon: cubeOutline },
    { title: 'Pedidos', url: '/admin/orders', icon: cartOutline },
    { title: 'Clientes', url: '/admin/customers', icon: peopleOutline },
    { title: 'Promociones', url: '/admin/marketing', icon: pricetagOutline },
    { title: 'Configuración', url: '/admin/settings', icon: settingsOutline },
];

export const MenuAdmin = () => {
    const location = useLocation();

    return (
        <IonMenu menuId="admin-menu" contentId="admin-content" type="overlay">
            <IonContent style={{ '--background': 'var(--admin-white)' }}>
                <IonList id="admin-list" lines="none">
                    <IonListHeader>Admin Panel</IonListHeader>
                    <IonNote style={{ marginLeft: '1rem' }}>tienda@ejemplo.com</IonNote>

                    {appPages.map((appPage, index) => (
                        <IonMenuToggle key={index} menu="admin-menu" autoHide={false}>
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
                    <div style={{ height: '1px', background: '#eee', margin: '20px 1rem' }}></div>

                    <IonItem
                        button
                        onClick={() => {
                            clearSession();
                            window.location.href = '/';
                        }}
                        className="logout-item"
                    >
                        <IonIcon slot="start" icon={logOutOutline} color="danger" />
                        <IonLabel color="danger">Cerrar Sesión</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonMenu>
    );
};