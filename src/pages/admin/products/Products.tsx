import React, { useEffect, useState } from 'react';
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
} from 'ionicons/icons';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchProducts,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk,
} from '../../../store/slices/product.slice';
import type { ProductCreate, ProductResponse, ProductUpdate } from '../../../interface/product.interface';

import { PageHeader, SearchBar, LoadingSpinner, EmptyState, ConfirmModal, StatusBadge } from '../../../components/shared';
import ProductModal from './ProductModal';

import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';

import '../../css/products.css';

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const { items: subcategories } = useAppSelector((state) => state.subcategorie);
  const { items: brands } = useAppSelector((state) => state.brand);

  const productsActive = products.filter((p) => p.status_id === 1 || p.status_id === 5);//5 = nuevo

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);



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

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleOpenEdit = (product: ProductResponse) => {
    setEditingProduct(product);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <IonPage>
      <PageHeader
        title="Productos"
        subtitle="Gestión del catálogo"
        actionIcon={addOutline}
        onAction={handleOpenCreate}
      />

      <IonContent className="products-page">
        <SearchBar
          value={searchTerm}
          onSearch={setSearchTerm}
          placeholder="Buscar por nombre, marca..."
        />

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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = product.status_id === 1 ? 'Activo' : product.status_id === 5 ? 'Nuevo' : 'Eliminado';
                  const subCat = subcategories.find(s => s.id_subcategorie === product.subcategorie_id);
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
                      <td>
                        <IonGrid className="product-actions-cell">
                          <IonButton fill="clear" color="primary" onClick={() => handleOpenEdit(product)}>
                            <IonIcon icon={createOutline} />
                          </IonButton>
                          <IonButton fill="clear" color="danger" onClick={() => handleDeleteRequest(product.id_product)}>
                            <IonIcon icon={trashOutline} />
                          </IonButton>
                        </IonGrid>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </IonGrid>
        )}

        <ProductModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
          product={editingProduct}
          loading={loading}
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
