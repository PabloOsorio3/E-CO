import React from 'react';
import { IonIcon } from '@ionic/react';
import { ribbonOutline } from 'ionicons/icons';
import type { BestSellingProductItem } from '../../../../interface/dashboard.interface';

interface DashboardBestSellingSpotlightProps {
  product: BestSellingProductItem | null;
  onDetails: () => void;
}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const DashboardBestSellingSpotlight: React.FC<DashboardBestSellingSpotlightProps> = ({ product, onDetails }) => {
  return (
    <div className="home-card home-best-selling-spotlight-card">
      <div className="home-card-title-row">
        <h2>Best Selling Product</h2>
      </div>

      {!product ? (
        <p className="home-empty-hint">Aún no hay ventas registradas.</p>
      ) : (
        <div className="home-best-selling-spotlight">
          <div className="home-best-selling-spotlight-icon">
            <IonIcon icon={ribbonOutline} />
          </div>
          <div className="home-best-selling-spotlight-info">
            <span className="home-best-selling-spotlight-name">{product.name}</span>
            <div className="home-best-selling-spotlight-metrics">
              <span>{product.quantity_sold} unidades vendidas</span>
              <span>{currencyFormatter.format(product.revenue)} en ingresos</span>
            </div>
          </div>
          <button className="home-details-btn" onClick={onDetails}>Details</button>
        </div>
      )}
    </div>
  );
};

export default DashboardBestSellingSpotlight;
