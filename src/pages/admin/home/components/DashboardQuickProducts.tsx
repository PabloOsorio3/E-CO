import React from 'react';
import { IonIcon } from '@ionic/react';
import { addCircleOutline, chevronForwardOutline, cubeOutline, pricetagOutline } from 'ionicons/icons';
import type { CategoryResponse } from '../../../../interface/category.interface';
import type { ProductResponse } from '../../../../interface/product.interface';

interface DashboardQuickProductsProps {
  categories: CategoryResponse[];
  products: ProductResponse[];
  onAddNew: () => void;
  onSeeMoreCategories: () => void;
  onSeeMoreProducts: () => void;
  onAddProduct: (product: ProductResponse) => void;
}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const DashboardQuickProducts: React.FC<DashboardQuickProductsProps> = ({
  categories,
  products,
  onAddNew,
  onSeeMoreCategories,
  onSeeMoreProducts,
  onAddProduct,
}) => {
  const topCategories = categories.slice(0, 3);
  const topProducts = products.slice(0, 3);

  return (
    <div className="home-card home-quick-products-card">
      <div className="home-card-title-row">
        <h2>Add New Product</h2>
        <button className="home-add-new-link" onClick={onAddNew}>
          <IonIcon icon={addCircleOutline} /> Add New
        </button>
      </div>

      <span className="home-quick-section-label">Categories</span>
      {topCategories.length === 0 ? (
        <p className="home-empty-hint">Sin categorías registradas.</p>
      ) : (
        <div className="home-quick-list">
          {topCategories.map((category) => (
            <div className="home-quick-row" key={category.id_category}>
              <div className="home-quick-icon"><IonIcon icon={pricetagOutline} /></div>
              <span className="home-quick-name">{category.name}</span>
              <IonIcon icon={chevronForwardOutline} className="home-quick-chevron" />
            </div>
          ))}
        </div>
      )}
      <button className="home-see-more" onClick={onSeeMoreCategories}>See more</button>

      <span className="home-quick-section-label">Product</span>
      {topProducts.length === 0 ? (
        <p className="home-empty-hint">Sin productos registrados.</p>
      ) : (
        <div className="home-quick-list">
          {topProducts.map((product) => (
            <div className="home-quick-product-row" key={product.id_product}>
              <div className="home-quick-product-info">
                <div className="home-quick-icon"><IonIcon icon={cubeOutline} /></div>
                <div>
                  <p className="home-quick-name">{product.name}</p>
                  <p className="home-quick-price">{currencyFormatter.format(product.price)}</p>
                </div>
              </div>
              <button className="home-add-btn" onClick={() => onAddProduct(product)}>
                <IonIcon icon={addCircleOutline} /> Add
              </button>
            </div>
          ))}
        </div>
      )}
      <button className="home-see-more" onClick={onSeeMoreProducts}>See more</button>
    </div>
  );
};

export default DashboardQuickProducts;
