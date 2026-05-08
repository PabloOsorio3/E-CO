import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { bookmark, bookmarkOutline, cubeOutline, fileTrayFull, fileTrayStacked, folderOpenOutline, gridOutline, pricetagOutline, settingsOutline, cardOutline } from 'ionicons/icons';
import { PageHeader } from '../../../components/shared';
import './setting.css';

import { useHistory } from 'react-router-dom';

const Setting: React.FC = () => {
    const history = useHistory();

    const settings = [
        { title: 'Categorías', subtitle: 'Gestionar categorías de productos', color: 'primary', icon: fileTrayFull, url: '/admin/settings-categories' },
        { title: 'Subcategorías', subtitle: 'Gestionar subcategorías de productos', color: 'tertiary', icon: fileTrayStacked, url: '/admin/settings-subcategories' },
        { title: 'Marcas', subtitle: 'Gestionar marcas de productos', color: 'secondary', icon: bookmarkOutline, url: '/admin/settings-brands' },
        { title: 'Estados', subtitle: 'Gestionar estados de productos', color: 'success', icon: gridOutline, url: '/admin/settings-status' },
        { title: 'Tipos de Pago', subtitle: 'Gestionar tipos de pago', color: 'warning', icon: cardOutline, url: '/admin/settings-payments' },
    ];

    return (
        <IonPage>
            <PageHeader
                title="Configuración"
                subtitle="Gestión de parámetros del sistema"
                actionIcon={settingsOutline}
                onAction={() => {}}
            />
            <IonContent className="settings-page" style={{ '--background': '#f8f9fa' }}>
                <IonGrid style={{ padding: '20px' }}>
                    <IonRow>
                        {settings.map((setting, index) => (
                            <IonCol size="12" sizeMd="6" sizeLg="4" key={index}>
                                <IonCard 
                                    onClick={() => history.push(setting.url)}
                                    className="setting-card-custom" 
                                    style={{ 
                                        margin: '0', 
                                        height: '100%', 
                                        cursor: 'pointer',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        transition: 'transform 0.2s ease',
                                        border: 'none',
                                        background: 'white'
                                    }}
                                >
                                    <div style={{ 
                                        padding: '24px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%'
                                    }}>
                                        <div style={{ 
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '14px',
                                            background: `var(--ion-color-${setting.color})`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '20px'
                                        }}>
                                            <IonIcon icon={setting.icon} style={{ color: 'white', fontSize: '30px' }}></IonIcon>
                                        </div>
                                        
                                        <IonCardHeader style={{ padding: '0', marginBottom: '12px' }}>
                                            <IonCardTitle style={{ 
                                                fontSize: '1.25rem', 
                                                fontWeight: '700',
                                                color: '#1a1a1a'
                                            }}>{setting.title}</IonCardTitle>
                                            <IonCardSubtitle style={{ 
                                                fontSize: '0.9rem',
                                                color: '#666',
                                                textTransform: 'none',
                                                marginTop: '4px'
                                            }}>{setting.subtitle}</IonCardSubtitle>
                                        </IonCardHeader>
                                        
                                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: `var(--ion-color-${setting.color})`, fontWeight: '600', fontSize: '0.9rem' }}>
                                            Gestionar <IonIcon icon={gridOutline} style={{ marginLeft: '8px' }} />
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