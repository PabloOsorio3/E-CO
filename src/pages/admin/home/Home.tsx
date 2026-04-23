import React, { useState } from "react";
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
  bagHandleOutline,
  searchOutline,
} from "ionicons/icons";

import {
  PageHeader,
  StatCard,
  StatusBadge,
  SearchBar,
  EmptyState,
  LoadingSpinner,
  ConfirmModal,
} from "../../../components/shared/";

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  return (
    <IonPage>
      <PageHeader title="E - CO" subtitle="Panel de Administración" />

      <IonContent className="ion-padding" scrollY={true}>
        {showLoading ? (
          <LoadingSpinner text="Cargando datos del dashboard..." />
        ) : (
          <>
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

            {/* --- Search Bar demo --- */}
            <SearchBar
              value={searchTerm}
              onSearch={setSearchTerm}
              placeholder="Buscar productos, pedidos..."
            />

            {/* --- Status Badges demo --- */}
            <div style={{ padding: "0 16px", display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
              <StatusBadge text="Completado" variant="success" />
              <StatusBadge text="Pendiente" variant="warning" />
              <StatusBadge text="Cancelado" variant="danger" />
              <StatusBadge text="En proceso" variant="info" />
              <StatusBadge text="Borrador" variant="neutral" />
              <StatusBadge text="Destacado" variant="primary" />
            </div>

            {/* --- Empty State demo --- */}
            <EmptyState
              icon={bagHandleOutline}
              title="Sin pedidos recientes"
              description="Cuando tus clientes hagan compras, los pedidos aparecerán aquí."
              actionText="Ver catálogo"
              onAction={() => console.log("Ir al catálogo")}
            />

            {/* --- Confirm Modal demo trigger --- */}
            <div style={{ textAlign: "center", marginTop: "12px", marginBottom: "32px" }}>
              <button
                onClick={() => setShowConfirm(true)}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Probar Modal de Confirmación
              </button>
              <span style={{ margin: "0 12px", color: "#999" }}>|</span>
              <button
                onClick={() => setShowLoading(true)}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Probar Loading Spinner
              </button>
            </div>

            <ConfirmModal
              isOpen={showConfirm}
              onClose={() => setShowConfirm(false)}
              onConfirm={() => console.log("Acción confirmada!")}
              title="¿Eliminar producto?"
              message="El producto será eliminado permanentemente. Esta acción no se puede deshacer."
              confirmText="Eliminar"
              variant="danger"
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;