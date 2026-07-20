import React, { useEffect } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { useHistory } from "react-router-dom";

import { PageHeader, LoadingSpinner } from "../../../components/shared";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchDashboardStatsThunk } from "../../../store/slices/dashboard.slice";
import { fetchOrdersThunk } from "../../../store/slices/order.slice";
import { showInfoAlert } from "../../../alerts/info/info-alert";

import DashboardStatCard from "./components/DashboardStatCard";
import DashboardPendingCard from "./components/DashboardPendingCard";
import DashboardTransactionsTable from "./components/DashboardTransactionsTable";
import DashboardQuickProducts from "./components/DashboardQuickProducts";
import DashboardPlaceholderCard from "./components/DashboardPlaceholderCard";

import "../../css/dashboard.css";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { stats, loading } = useAppSelector((state) => state.dashboard);
  const { items: orders } = useAppSelector((state) => state.order);
  const { items: statuses } = useAppSelector((state) => state.status);
  const { items: categories } = useAppSelector((state) => state.category);
  const { items: products } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchDashboardStatsThunk());
    dispatch(fetchOrdersThunk());
  }, [dispatch]);

  const pendingCount = orders.filter((o) => {
    const name = statuses.find((s) => s.id_status === o.status_id)?.name ?? "";
    return name.toLowerCase().includes("pend");
  }).length;

  const canceledCount = orders.filter((o) => {
    const name = statuses.find((s) => s.id_status === o.status_id)?.name ?? "";
    return name.toLowerCase().includes("cancel");
  }).length;

  const activeProducts = products.filter((p) => p.status_id === 1 || p.status_id === 5);

  return (
    <IonPage>
      <PageHeader title="E - CO" subtitle="Panel de Administración" />

      <IonContent className="home-dashboard-content" scrollY={true}>
        {loading && !stats ? (
          <LoadingSpinner text="Cargando métricas..." />
        ) : (
          <div className="home-page-inner">
            <div className="home-stats-row">
              <DashboardStatCard
                title="Total Sales"
                value={currencyFormatter.format(stats?.total_sales ?? 0)}
                trendValue={stats?.total_sales_trend}
                onDetails={() => showInfoAlert("Función no disponible todavía")}
              />
              <DashboardStatCard
                title="Total Orders"
                value={String(stats?.new_orders ?? 0)}
                trendValue={stats?.new_orders_trend}
                onDetails={() => history.push("/admin/orders")}
              />
              <DashboardPendingCard
                pending={pendingCount}
                canceled={canceledCount}
                onDetails={() => history.push("/admin/orders")}
              />
            </div>

            <div className="home-content-row">
              <DashboardPlaceholderCard title="Report for this week" />
              <DashboardPlaceholderCard title="Sales by Country" />
            </div>

            <div className="home-content-row">
              <DashboardTransactionsTable
                orders={orders}
                statuses={statuses}
                onFilter={() => showInfoAlert("Función no disponible todavía")}
                onDetails={() => history.push("/admin/orders")}
              />
              <DashboardPlaceholderCard title="Best Selling Products" />
            </div>

            <div className="home-content-row">
              <DashboardPlaceholderCard title="Best Selling Product" />
              <DashboardQuickProducts
                categories={categories}
                products={activeProducts}
                onAddNew={() => history.push("/admin/products")}
                onSeeMoreCategories={() => history.push("/admin/settings-category")}
                onSeeMoreProducts={() => history.push("/admin/products")}
                onAddProduct={() => showInfoAlert("Función no disponible todavía")}
              />
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
