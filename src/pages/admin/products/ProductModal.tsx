import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import type { ProductCreate, ProductResponse, ProductUpdate } from '../../../interface/product.interface';
import '../../css/products.css';
import { productService } from '../../../services/product/product.service';

import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import type { SubCategorieResponse } from '../../../interface/subcategorie.interface';
import type { StatusResponse } from '../../../interface/status.interface';
import type { BrandResponse } from '../../../interface/brand.interface';
import type { CategoryResponse } from '../../../interface/category.interface';



interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductCreate) => void;

  product?: ProductResponse | null;
  loading?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  loading = false,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brandId, setBrandId] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [subcategorieId, setSubcategorieId] = useState<number>(1);
  const [statusId, setStatusId] = useState<number>(1);

  const subcategories = useSelector((state: RootState) => state.subcategorie.items);
  const status = useSelector((state: RootState) => state.status.items);
  const brands = useSelector((state: RootState) => state.brand.items);
  const categories = useSelector((state: RootState) => state.category.items);

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setBrandId(product.brand_id);
      setPrice(product.price);
      setCategoryId(product.category_id);
      setSubcategorieId(product.subcategorie_id);
      setStatusId(product.status_id);
    } else {
      setName('');
      setDescription('');
      setBrandId(1);
      setPrice(0);
      setCategoryId(1);
      setSubcategorieId(1);
      setStatusId(1);
    }
  }, [product, isOpen]);

  const handleSaveProduct = () => {
    const data: ProductCreate = {
      name: name.trim(),
      description: description.trim(),
      brand_id: brandId,
      price,
      category_id: categoryId,
      subcategorie_id: subcategorieId,
      status_id: statusId,
    };

    onSave(data);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="product-modal" breakpoints={[0, 1]} initialBreakpoint={1}>
      <div className="modal-header">
        <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <IonButton fill="clear" onClick={onClose}>
          <IonIcon icon={closeOutline} />
        </IonButton>
      </div>

      <div className="modal-body">
        <IonInput
          className="form-input"
          label="Nombre del Producto"
          labelPlacement="floating"
          fill="outline"
          value={name}
          onIonInput={(e) => setName(e.detail.value ?? '')}
          placeholder="Ej: Laptop Pro 15"
        />

        <IonTextarea
          className="form-textarea"
          label="Descripción"
          labelPlacement="floating"
          fill="outline"
          value={description}
          onIonInput={(e) => setDescription(e.detail.value ?? '')}
          placeholder="Describe el producto..."
          rows={4}
        />

        <IonSelect
          className="form-select"
          label="Marca"
          labelPlacement="floating"
          fill="outline"
          value={brandId}
          onIonChange={(e) => setBrandId(e.detail.value)}
        >
          {brands.map((b) => (
            <IonSelectOption key={b.id_brand} value={b.id_brand}>
              {b.brand_name}
            </IonSelectOption>
          ))}
        </IonSelect>

        <IonInput
          className="form-input"
          label="Precio"
          labelPlacement="floating"
          fill="outline"
          type="number"
          value={price}
          onIonInput={(e) => setPrice(parseFloat(e.detail.value ?? '0'))}
          placeholder="0.00"
          min={0}
        />

        <IonSelect
          className="form-select"
          label="Categoría"
          labelPlacement="floating"
          fill="outline"
          value={categoryId}
          onIonChange={(e) => {
            setCategoryId(e.detail.value);
            const firstSubCat = subcategories.find(sc => sc.category_id === e.detail.value);
            if (firstSubCat) {
              setSubcategorieId(firstSubCat.id_subcategorie);
            } else {
              setSubcategorieId(0);
            }
          }}
        >
          {categories.map((c) => (
            <IonSelectOption key={c.id_category} value={c.id_category}>
              {c.name}
            </IonSelectOption>
          ))}
        </IonSelect>

        <IonSelect
          className="form-select"
          label="Subcategoría"
          labelPlacement="floating"
          fill="outline"
          value={subcategorieId}
          onIonChange={(e) => setSubcategorieId(e.detail.value)}
          disabled={!categoryId}
        >
          {subcategories
            .filter((sc) => sc.category_id === categoryId)
            .map((sc) => (
              <IonSelectOption key={sc.id_subcategorie} value={sc.id_subcategorie}>
                {sc.name}
              </IonSelectOption>
            ))}
        </IonSelect>

        <IonSelect
          className="form-select"
          label="Estado"
          labelPlacement="floating"
          fill="outline"
          value={statusId}
          onIonChange={(e) => setStatusId(e.detail.value)}
        >
          {status.map((s) => (
            <IonSelectOption key={s.id_status} value={s.id_status}>
              {s.name}
            </IonSelectOption>
          ))}
        </IonSelect>
      </div>

      <div className="modal-footer">
        <IonButton expand="block" className="btn-modal-cancel" onClick={onClose}>
          Cancelar
        </IonButton>
        <IonButton expand="block" className="btn-save" onClick={handleSaveProduct} disabled={loading}>
          {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Producto'}
        </IonButton>
      </div>


    </IonModal>
  );
};

export default ProductModal;
