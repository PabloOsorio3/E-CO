import React, { useEffect, useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { useHistory } from "react-router-dom";

import { PageHeader, LoadingSpinner, PlaceholderCard } from "../../../components/shared";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchDashboardStatsThunk,
  fetchSalesReportThunk,
  fetchBestSellingProductsThunk,
} from "../../../store/slices/dashboard.slice";
import { fetchOrdersThunk } from "../../../store/slices/order.slice";
import { fetchProducts } from "../../../store/slices/product.slice";
import { createInventoryMovementThunk } from "../../../store/slices/inventory.slice";
import { showSuccessAlert } from "../../../alerts/success/success-alert";
import { showErrorAlert } from "../../../alerts/error/error-alert";

import DashboardStatCard from "./components/DashboardStatCard";
import DashboardPendingCard from "./components/DashboardPendingCard";
import DashboardTransactionsTable from "./components/DashboardTransactionsTable";
import DashboardQuickProducts from "./components/DashboardQuickProducts";
import DashboardSalesReportCard from "./components/DashboardSalesReportCard";
import DashboardBestSellingList from "./components/DashboardBestSellingList";
import DashboardBestSellingSpotlight from "./components/DashboardBestSellingSpotlight";
import StockModal from "../products/StockModal";

import type { ProductResponse } from "../../../interface/product.interface";
import type { InventoryMovementCreate } from "../../../interface/inventory.interface";

import "../../css/dashboard.css";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { stats, salesReport, bestSellingProducts, loading } = useAppSelector((state) => state.dashboard);
  const { items: orders } = useAppSelector((state) => state.order);
  const { items: statuses } = useAppSelector((state) => state.status);
  const { items: categories } = useAppSelector((state) => state.category);
  const { items: products } = useAppSelector((state) => state.products);
  const { loading: savingStock } = useAppSelector((state) => state.inventory);

  const [showStockModal, setShowStockModal] = useState(false);
  const [stockProduct, setStockProduct] = useState<ProductResponse | null>(null);
  const [stockModalKey, setStockModalKey] = useState(0);

  useEffect(() => {
    dispatch(fetchDashboardStatsThunk());
    dispatch(fetchOrdersThunk());
    dispatch(fetchSalesReportThunk(7));
    dispatch(fetchBestSellingProductsThunk(5));
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

  const handleOpenStock = (product: ProductResponse) => {
    setStockProduct(product);
    setStockModalKey((k) => k + 1);
    setShowStockModal(true);
  };

  const handleSaveStock = async (data: InventoryMovementCreate) => {
    try {
      await dispatch(createInventoryMovementThunk(data)).unwrap();
      dispatch(fetchProducts());
      showSuccessAlert('Movimiento de inventario registrado exitosamente');
      setShowStockModal(false);
      setStockProduct(null);
    } catch (error: any) {
      showErrorAlert(error || 'Error al registrar el movimiento de inventario');
    }
  };

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
                onDetails={() => history.push("/admin/transaction")}
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
              <DashboardSalesReportCard report={salesReport} />
              <PlaceholderCard title="Sales by Country" />
            </div>

            <div className="home-content-row">
              <DashboardTransactionsTable
                orders={orders}
                statuses={statuses}
                onDetails={() => history.push("/admin/orders")}
              />
              <DashboardBestSellingList products={bestSellingProducts} />
            </div>

            <div className="home-content-row">
              <DashboardBestSellingSpotlight
                product={bestSellingProducts[0] ?? null}
                onDetails={() => history.push("/admin/products")}
              />
              <DashboardQuickProducts
                categories={categories}
                products={activeProducts}
                onAddNew={() => history.push("/admin/products")}
                onSeeMoreCategories={() => history.push("/admin/settings/category")}
                onSeeMoreProducts={() => history.push("/admin/products")}
                onAddProduct={handleOpenStock}
              />
            </div>
          </div>
        )}

        <StockModal
          key={stockModalKey}
          isOpen={showStockModal}
          onClose={() => setShowStockModal(false)}
          onSave={handleSaveStock}
          product={stockProduct}
          loading={savingStock}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
