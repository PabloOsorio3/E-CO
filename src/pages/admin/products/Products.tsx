import React, { useMemo, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonGrid,
} from '@ionic/react';
import {
  addOutline,
  createOutline,
  trashOutline,
  cubeOutline,
  swapVerticalOutline,
  imagesOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchProducts,
  createProductThunk,
  updateProductThunk,
} from '../../../store/slices/product.slice';
import { createInventoryMovementThunk } from '../../../store/slices/inventory.slice';
import type { ProductCreate, ProductResponse, ProductUpdate } from '../../../interface/product.interface';
import type { InventoryMovementCreate } from '../../../interface/inventory.interface';

import { AdminTopBar, LoadingSpinner, EmptyState, ConfirmModal, StatusBadge } from '../../../components/shared';
import ProductModal from './ProductModal';
import StockModal from './StockModal';
import ImageManagerModal from './ImageManagerModal';

import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';

import '../../css/products.css';

const PAGE_SIZE = 10;

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const { items: subcategory } = useAppSelector((state) => state.subcategory);
  const { items: brands } = useAppSelector((state) => state.brand);

  const productsActive = products.filter((p) => p.status_id === 1 || p.status_id === 5);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockProduct, setStockProduct] = useState<ProductResponse | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageProduct, setImageProduct] = useState<ProductResponse | null>(null);
  // Se incrementa en cada apertura para forzar el remount del modal
  // (así el modal inicializa su estado local desde props sin usar un efecto).
  const [modalKey, setModalKey] = useState(0);
  const [stockModalKey, setStockModalKey] = useState(0);

  const filteredProducts = productsActive.filter((p) => {
    const term = searchTerm.toLowerCase();
    const brandObj = brands.find(b => b.id_brand === p.brand_id);
    const brandName = brandObj ? brandObj.brand_name.toLowerCase() : '';
    return (
      p.name.toLowerCase().includes(term) ||
      brandName.includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pageProducts = useMemo(
    () => filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredProducts, currentPage]
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    history.push('/admin/products/add');
  };

  const handleOpenEdit = (product: ProductResponse) => {
    setEditingProduct(product);
    setModalKey((k) => k + 1);
    setShowModal(true);
  };

  const handleSave = async (data: ProductCreate | ProductUpdate) => {
    try {
      if (editingProduct) {
        await dispatch(updateProductThunk({ id: editingProduct.id_product, data })).unwrap();
        showSuccessAlert('Producto actualizado exitosamente');
      } else {
        await dispatch(createProductThunk(data as ProductCreate)).unwrap();
        showSuccessAlert('Producto creado exitosamente');
      }
      dispatch(fetchProducts());
      setShowModal(false);
      setEditingProduct(null);
    } catch (error: any) {
      showErrorAlert(error || 'Error al guardar el producto');
    }
  };

  const handleDeleteRequest = (id: number) => {
    setDeletingProductId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingProductId === null) return;
    try {
      await dispatch(updateProductThunk({ id: deletingProductId, data: { status_id: 2 } })).unwrap();
      dispatch(fetchProducts());
      showSuccessAlert('Producto desactivado exitosamente');
    } catch (error: any) {
      showErrorAlert(error || 'Error al desactivar el producto');
    }
    setDeletingProductId(null);
  };

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

  const handleOpenImages = (product: ProductResponse) => {
    setImageProduct(product);
    setShowImageModal(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <IonPage>
      <AdminTopBar
        title="Productos"
        search={{ value: searchTerm, onChange: handleSearch, placeholder: 'Buscar por nombre, marca...' }}
        action={{ icon: addOutline, onClick: handleOpenCreate, label: 'Agregar producto' }}
      />

      <IonContent className="products-page">
        <IonGrid className="products-toolbar">
          <span className="products-count">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </IonGrid>

        {loading && products.length === 0 ? (
          <LoadingSpinner text="Cargando productos..." />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={cubeOutline}
            title={searchTerm ? 'Sin resultados' : 'Sin productos'}
            description={
              searchTerm
                ? `No se encontraron productos para "${searchTerm}"`
                : 'Aún no has agregado productos. ¡Comienza creando uno!'
            }
            actionText={searchTerm ? undefined : 'Crear Producto'}
            onAction={searchTerm ? undefined : handleOpenCreate}
          />
        ) : (
          <IonGrid className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th className="col-description">Descripción</th>
                  <th>Marca</th>
                  <th>Precio</th>
                  <th className="col-subcategory">Categoría</th>
                  <th>Estado</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pageProducts.map((product) => {
                  const subCat = subcategory.find(s => s.id_subcategory === product.subcategory_id);
                  const subCatName = subCat ? subCat.name : 'N/A';
                  const brandObj = brands.find(b => b.id_brand === product.brand_id);
                  const brandNameRow = brandObj ? brandObj.brand_name : 'N/A';
                  return (
                    <tr key={product.id_product}>
                      <td>#{product.id_product}</td>
                      <td className="product-name-cell">{product.name}</td>
                      <td className="col-description" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.description}
                      </td>
                      <td className="product-brand-cell">{brandNameRow}</td>
                      <td className="product-price-cell">{formatPrice(product.price)}</td>
                      <td className="col-subcategory">{subCatName}</td>
                      <td>
                        <StatusBadge statusId={product.status_id} />
                      </td>
                      <td className="product-stock-cell">{product.stock}</td>
                      <td>
                        <div className="product-actions-cell">
                          <IonButton fill="clear" className="product-icon-btn edit" onClick={() => handleOpenEdit(product)}>
                            <IonIcon icon={createOutline} />
                          </IonButton>
                          <IonButton fill="clear" className="product-icon-btn neutral" onClick={() => handleOpenStock(product)} title="Ajustar stock">
                            <IonIcon icon={swapVerticalOutline} />
                          </IonButton>
                          <IonButton fill="clear" className="product-icon-btn neutral" onClick={() => handleOpenImages(product)} title="Gestionar imágenes">
                            <IonIcon icon={imagesOutline} />
                          </IonButton>
                          <IonButton fill="clear" className="product-icon-btn delete" onClick={() => handleDeleteRequest(product.id_product)}>
                            <IonIcon icon={trashOutline} />
                          </IonButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </IonGrid>
        )}

        {totalPages > 1 && (
          <div className="products-pagination-controls">
            <button
              className="products-pagination-nav-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <IonIcon icon={chevronBackOutline} />
              Previous
            </button>

            <div className="products-pagination-numbers-list">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`products-pagination-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              className="products-pagination-nav-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
              <IonIcon icon={chevronForwardOutline} />
            </button>
          </div>
        )}

        <ProductModal
          key={modalKey}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
          product={editingProduct}
          loading={loading}
        />

        <StockModal
          key={stockModalKey}
          isOpen={showStockModal}
          onClose={() => {
            setShowStockModal(false);
            setStockProduct(null);
          }}
          onSave={handleSaveStock}
          product={stockProduct}
          loading={loading}
        />

        <ImageManagerModal
          isOpen={showImageModal}
          onClose={() => {
            setShowImageModal(false);
            setImageProduct(null);
          }}
          product={imageProduct}
        />

        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setDeletingProductId(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar producto?"
          message="El producto será eliminado permanentemente del catálogo. Esta acción no se puede deshacer."
          confirmText="Eliminar"
          variant="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Products;
