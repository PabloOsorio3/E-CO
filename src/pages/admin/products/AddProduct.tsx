import React, { useEffect, useRef, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonCheckbox,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { cloudUploadOutline, trashOutline, checkmarkCircleOutline } from 'ionicons/icons';

import { PageHeader, PlaceholderCard, ConfirmModal } from '../../../components/shared';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createProductThunk } from '../../../store/slices/product.slice';
import { fetchImagesThunk, uploadImageThunk, deleteImageThunk, clearImages } from '../../../store/slices/image.slice';
import type { ProductCreate, ProductResponse } from '../../../interface/product.interface';
import { STATIC_BASE_URL } from '../../../api/instance/instance';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';

import '../../css/dashboard.css';
import '../../css/products.css';

const AddProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const category = useAppSelector((state) => state.category.items);
  const subcategory = useAppSelector((state) => state.subcategory.items);
  const status = useAppSelector((state) => state.status.items);
  const brands = useAppSelector((state) => state.brand.items);
  const { loading } = useAppSelector((state) => state.products);
  const { items: images, loading: imagesLoading } = useAppSelector((state) => state.images);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brandId, setBrandId] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [subcategoryId, setSubcategoryId] = useState<number>(0);
  const [statusId, setStatusId] = useState<number>(1);
  const [initialStock, setInitialStock] = useState<number>(0);

  const [createdProduct, setCreatedProduct] = useState<ProductResponse | null>(null);
  const [isMain, setIsMain] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  useEffect(() => {
    const firstSubCat = subcategory.find((sc) => sc.category_id === categoryId);
    setSubcategoryId(firstSubCat ? firstSubCat.id_subcategory : 0);
    // Solo se recalcula cuando cambia la categoría elegida.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  useEffect(() => {
    return () => {
      dispatch(clearImages());
    };
  }, [dispatch]);

  const handlePublish = async () => {
    if (!name.trim() || !subcategoryId) {
      showErrorAlert('Completa al menos el nombre y una categoría válida.');
      return;
    }
    const data: ProductCreate = {
      name: name.trim(),
      description: description.trim(),
      brand_id: brandId,
      price,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      status_id: statusId,
      initial_stock: initialStock,
    };

    try {
      const result = await dispatch(createProductThunk(data)).unwrap();
      showSuccessAlert('Producto creado exitosamente');
      setCreatedProduct(result);
      dispatch(fetchImagesThunk(result.id_product));
    } catch (error: any) {
      showErrorAlert(error || 'Error al crear el producto');
    }
  };

  const handleUploadImage = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !createdProduct) return;
    try {
      await dispatch(uploadImageThunk({ productId: createdProduct.id_product, file, isMain })).unwrap();
      showSuccessAlert('Imagen subida exitosamente');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsMain(false);
    } catch (error: any) {
      showErrorAlert(error || 'Error al subir la imagen');
    }
  };

  const handleDeleteImageRequest = (idImage: number) => {
    setDeletingImageId(idImage);
    setShowDeleteConfirm(true);
  };

  const handleDeleteImageConfirm = async () => {
    if (deletingImageId === null) return;
    try {
      await dispatch(deleteImageThunk(deletingImageId)).unwrap();
      showSuccessAlert('Imagen eliminada exitosamente');
    } catch (error: any) {
      showErrorAlert(error || 'Error al eliminar la imagen');
    }
    setDeletingImageId(null);
  };

  return (
    <IonPage>
      <PageHeader
        title="Agregar Producto"
        subtitle="Nuevo producto para el catálogo"
        showBackButton
        defaultBackHref="/admin/products"
      />

      <IonContent className="products-page">
        <div className="home-page-inner">
          <div className="add-product-grid">
            {/* Basic Details */}
            <div className="home-card">
              <div className="home-card-title-row">
                <h2>Basic Details</h2>
              </div>

              <div className="add-product-field">
                <label className="add-product-label">Product Name</label>
                <IonInput
                  className="add-product-input"
                  fill="outline"
                  value={name}
                  onIonInput={(e) => setName(e.detail.value ?? '')}
                  placeholder="Ej: iPhone 15"
                  disabled={!!createdProduct}
                />
              </div>

              <div className="add-product-field">
                <label className="add-product-label">Product Description</label>
                <IonTextarea
                  className="add-product-input"
                  fill="outline"
                  value={description}
                  onIonInput={(e) => setDescription(e.detail.value ?? '')}
                  placeholder="Describe el producto..."
                  rows={4}
                  disabled={!!createdProduct}
                />
              </div>

              <div className="add-product-field">
                <label className="add-product-label">Brand</label>
                <IonSelect
                  className="add-product-input"
                  fill="outline"
                  value={brandId}
                  onIonChange={(e) => setBrandId(e.detail.value)}
                  disabled={!!createdProduct}
                >
                  {brands.map((b) => (
                    <IonSelectOption key={b.id_brand} value={b.id_brand}>
                      {b.brand_name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>

              <p className="add-product-section-title">Pricing</p>

              <div className="add-product-field">
                <label className="add-product-label">Product Price</label>
                <IonInput
                  className="add-product-input"
                  fill="outline"
                  type="number"
                  value={price}
                  onIonInput={(e) => setPrice(parseFloat(e.detail.value ?? '0'))}
                  placeholder="0.00"
                  min={0}
                  disabled={!!createdProduct}
                />
              </div>

              <p className="add-product-section-title">Inventory</p>

              <div className="add-product-row">
                <div className="add-product-field">
                  <label className="add-product-label">Categoría</label>
                  <IonSelect
                    className="add-product-input"
                    fill="outline"
                    value={categoryId}
                    onIonChange={(e) => setCategoryId(e.detail.value)}
                    disabled={!!createdProduct}
                  >
                    {category.map((c) => (
                      <IonSelectOption key={c.id_category} value={c.id_category}>
                        {c.name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </div>

                <div className="add-product-field">
                  <label className="add-product-label">Subcategoría</label>
                  <IonSelect
                    className="add-product-input"
                    fill="outline"
                    value={subcategoryId}
                    onIonChange={(e) => setSubcategoryId(e.detail.value)}
                    disabled={!!createdProduct || !categoryId}
                  >
                    {subcategory
                      .filter((sc) => sc.category_id === categoryId)
                      .map((sc) => (
                        <IonSelectOption key={sc.id_subcategory} value={sc.id_subcategory}>
                          {sc.name}
                        </IonSelectOption>
                      ))}
                  </IonSelect>
                </div>
              </div>

              <div className="add-product-row">
                <div className="add-product-field">
                  <label className="add-product-label">Stock Quantity</label>
                  <IonInput
                    className="add-product-input"
                    fill="outline"
                    type="number"
                    min={0}
                    value={initialStock}
                    onIonInput={(e) => setInitialStock(parseInt(e.detail.value ?? '0', 10) || 0)}
                    placeholder="0"
                    disabled={!!createdProduct}
                  />
                </div>

                <div className="add-product-field">
                  <label className="add-product-label">Stock Status</label>
                  <IonSelect
                    className="add-product-input"
                    fill="outline"
                    value={statusId}
                    onIonChange={(e) => setStatusId(e.detail.value)}
                    disabled={!!createdProduct}
                  >
                    {status.map((s) => (
                      <IonSelectOption key={s.id_status} value={s.id_status}>
                        {s.name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </div>
              </div>

              <div className="add-product-actions">
                {createdProduct ? (
                  <IonButton className="add-product-btn-published" disabled>
                    <IonIcon icon={checkmarkCircleOutline} slot="start" />
                    Producto creado
                  </IonButton>
                ) : (
                  <IonButton
                    className="add-product-btn-publish"
                    onClick={handlePublish}
                    disabled={loading}
                  >
                    {loading ? 'Creando...' : 'Publicar producto'}
                  </IonButton>
                )}
                {createdProduct && (
                  <IonButton
                    fill="outline"
                    className="add-product-btn-secondary"
                    onClick={() => history.push('/admin/products')}
                  >
                    Ver en el listado
                  </IonButton>
                )}
              </div>
            </div>

            {/* Upload Product Image */}
            {!createdProduct ? (
              <PlaceholderCard
                title="Upload Product Image"
                message="Crea el producto primero para poder subir imágenes."
              />
            ) : (
              <div className="home-card">
                <div className="home-card-title-row">
                  <h2>Upload Product Image</h2>
                </div>

                {imagesLoading && images.length === 0 ? (
                  <p className="home-empty-hint">Cargando imágenes...</p>
                ) : images.length === 0 ? (
                  <p className="home-empty-hint">Este producto todavía no tiene imágenes.</p>
                ) : (
                  <div className="image-manager-grid">
                    {images.map((img) => (
                      <div key={img.id_image} className="image-manager-thumb">
                        <img src={`${STATIC_BASE_URL}${img.url_image}`} alt={createdProduct.name} />
                        {img.is_main && <span className="image-manager-main-badge">Principal</span>}
                        <button
                          className="image-manager-delete-btn"
                          title="Eliminar imagen"
                          onClick={() => handleDeleteImageRequest(img.id_image)}
                        >
                          <IonIcon icon={trashOutline} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="image-manager-upload-row">
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" />
                  <label className="image-manager-main-check">
                    <IonCheckbox checked={isMain} onIonChange={(e) => setIsMain(e.detail.checked)} />
                    Imagen principal
                  </label>
                  <IonButton className="add-product-btn-publish" onClick={handleUploadImage} disabled={imagesLoading}>
                    <IonIcon icon={cloudUploadOutline} slot="start" />
                    Subir
                  </IonButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </IonContent>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingImageId(null);
        }}
        onConfirm={handleDeleteImageConfirm}
        title="¿Eliminar imagen?"
        message="La imagen será eliminada permanentemente. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </IonPage>
  );
};

export default AddProduct;
