import React from "react";
import { IonButtons, IonContent, IonButton, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";

const Home: React.FC = () => {
    return (
        <IonPage id="main-content">
            <IonHeader className="ion-no-border">
                <IonToolbar style={{ '--background': '#000000ff', '--color': 'white' }}>
                    <IonButtons slot="start">
                        <IonMenuButton color="primary" />
                    </IonButtons>
                    <IonTitle style={{ fontWeight: 'bold' }}>E - CO</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" scrollY={false}>
                <div className="welcome-container">
                    <div className="admin-card">
                        <IonIcon
                            icon={personCircleOutline}
                            style={{ fontSize: '64px', color: 'var(--ion-color-primary)' }}
                        />
                        <h1>Bienvenido al Panel de Control</h1>
                        <p>Gestiona tu tienda con facilidad. Selecciona una opción en el menú lateral para comenzar.</p>

                        <IonButton mode="ios" expand="block" color="primary" style={{ marginTop: '20px', fontWeight: 'bold' }}>
                            Ver Estadísticas
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Home;