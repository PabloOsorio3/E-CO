import React from "react";
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import {
  cashOutline,
  cubeOutline,
  cartOutline,
  peopleOutline,
} from "ionicons/icons";

import {
  PageHeader,
  StatCard,
} from "../../../components/shared/";

const Home: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="E - CO" subtitle="Panel de Administración" />

      <IonContent className="ion-padding" scrollY={true}>
        {/* --- Stat Cards --- */}
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <StatCard
                label="Ventas Totales"
                value="$12,580"
                icon={cashOutline}
                variant="success"
                trendValue={12.5}
                periodText="vs. mes anterior"
              />
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <StatCard
                label="Pedidos Nuevos"
                value="34"
                icon={cartOutline}
                variant="primary"
                trendValue={8.2}
                periodText="esta semana"
              />
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <StatCard
                label="Productos"
                value="128"
                icon={cubeOutline}
                variant="info"
                trendValue={-2.1}
                periodText="stock bajo"
              />
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <StatCard
                label="Clientes"
                value="1,240"
                icon={peopleOutline}
                variant="warning"
                trendValue={5.7}
                periodText="nuevos este mes"
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;