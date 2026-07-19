import React, { useEffect } from "react";
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
  LoadingSpinner,
} from "../../../components/shared/";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchDashboardStatsThunk } from "../../../store/slices/dashboard.slice";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStatsThunk());
  }, [dispatch]);

  return (
    <IonPage>
      <PageHeader title="E - CO" subtitle="Panel de Administración" />

      <IonContent className="ion-padding" scrollY={true}>
        {loading && !stats ? (
          <LoadingSpinner text="Cargando métricas..." />
        ) : (
          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <StatCard
                  label="Ventas Totales"
                  value={currencyFormatter.format(stats?.total_sales ?? 0)}
                  icon={cashOutline}
                  variant="success"
                  trendValue={stats?.total_sales_trend}
                  periodText="vs. mes anterior"
                />
              </IonCol>
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <StatCard
                  label="Pedidos Nuevos"
                  value={stats?.new_orders ?? 0}
                  icon={cartOutline}
                  variant="primary"
                  trendValue={stats?.new_orders_trend}
                  periodText="vs. mes anterior"
                />
              </IonCol>
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <StatCard
                  label="Productos"
                  value={stats?.products_count ?? 0}
                  icon={cubeOutline}
                  variant="info"
                />
              </IonCol>
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <StatCard
                  label="Clientes"
                  value={stats?.customers_count ?? 0}
                  icon={peopleOutline}
                  variant="warning"
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;