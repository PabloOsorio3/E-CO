import React from 'react';
import type { BestSellingProductItem } from '../../../../interface/dashboard.interface';

interface DashboardBestSellingListProps {
  products: BestSellingProductItem[];
}

const DashboardBestSellingList: React.FC<DashboardBestSellingListProps> = ({ products }) => {
  return (
    <div className="home-card home-best-selling-list-card">
      <div className="home-card-title-row">
        <h2>Best Selling Products</h2>
      </div>

      {products.length === 0 ? (
        <p className="home-empty-hint">Aún no hay ventas registradas.</p>
      ) : (
        <div className="home-best-selling-list">
          {products.map((product, index) => (
            <div className="home-best-selling-row" key={product.id_product}>
              <span className="home-best-selling-rank">{index + 1}</span>
              <span className="home-best-selling-name">{product.name}</span>
              <span className="home-best-selling-qty">{product.quantity_sold} vendidos</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardBestSellingList;
