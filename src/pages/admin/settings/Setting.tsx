import React from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { bookmarkOutline, fileTrayFull, fileTrayStacked, gridOutline, settingsOutline, cardOutline, arrowForwardOutline } from 'ionicons/icons';
import { PageHeader } from '../../../components/shared';
import '../../css/settings.css';

import { useHistory } from 'react-router-dom';

const Setting: React.FC = () => {
    const history = useHistory();

    const settings = [
        { title: 'Categorías', subtitle: 'Gestionar categorías de productos', color: '#4ea674', icon: fileTrayFull, url: '/admin/settings-category' },
        { title: 'Subcategorías', subtitle: 'Gestionar subcategorías de productos', color: '#023337', icon: fileTrayStacked, url: '/admin/settings-subcategory' },
        { title: 'Marcas', subtitle: 'Gestionar marcas de productos', color: '#6467f2', icon: bookmarkOutline, url: '/admin/settings-brands' },
        { title: 'Estados', subtitle: 'Gestionar estados de productos', color: '#21c45d', icon: gridOutline, url: '/admin/settings-status' },
        { title: 'Tipos de Pago', subtitle: 'Gestionar tipos de pago', color: '#fbbd23', icon: cardOutline, url: '/admin/settings-payments' },
    ];

    return (
        <IonPage>
            <PageHeader
                title="Configuración"
                subtitle="Gestión de parámetros del sistema"
                actionIcon={settingsOutline}
                onAction={() => { }}
            />
            <IonContent className="settings-page">
                <IonGrid style={{ padding: '16px' }}>
                    <IonRow>
                        {settings.map((setting, index) => (
                            <IonCol size="12" sizeMd="6" sizeLg="4" key={index}>
                                <IonCard
                                    onClick={() => history.push(setting.url)}
                                    className="settings-hub-card"
                                >
                                    <div className="settings-hub-card-body">
                                        <div className="settings-hub-icon" style={{ background: setting.color }}>
                                            <IonIcon icon={setting.icon} />
                                        </div>

                                        <IonCardHeader style={{ padding: '0', marginBottom: '12px' }}>
                                            <IonCardTitle className="settings-hub-title">{setting.title}</IonCardTitle>
                                            <IonCardSubtitle className="settings-hub-subtitle">{setting.subtitle}</IonCardSubtitle>
                                        </IonCardHeader>

                                        <div className="settings-hub-cta" style={{ color: setting.color }}>
                                            Gestionar <IonIcon icon={arrowForwardOutline} />
                                        </div>
                                    </div>
                                </IonCard>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}
export default Setting;