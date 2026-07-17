import React, { useState } from 'react';
import {
  IonModal,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonIcon,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import type { ProductCreate, ProductResponse } from '../../../interface/product.interface';
import '../../css/products.css';

import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

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
  // El componente se remonta (via `key` en el padre) cada vez que se abre,
  // por lo que el estado inicial se calcula una sola vez a partir de `product`.
  const [name, setName] = useState(() => product?.name ?? '');
  const [description, setDescription] = useState(() => product?.description ?? '');
  const [brandId, setBrandId] = useState<number>(() => product?.brand_id ?? 1);
  const [price, setPrice] = useState<number>(() => product?.price ?? 0);
  const [categoryId, setCategoryId] = useState<number>(() => product?.category_id ?? 1);
  const [subcategoryId, setSubcategoryId] = useState<number>(() => product?.subcategory_id ?? 1);
  const [statusId, setStatusId] = useState<number>(() => product?.status_id ?? 1);

  const subcategory = useSelector((state: RootState) => state.subcategory.items);
  const status = useSelector((state: RootState) => state.status.items);
  const brands = useSelector((state: RootState) => state.brand.items);
  const category = useSelector((state: RootState) => state.category.items);

  const isEditing = !!product;

  const handleSaveProduct = () => {
    const data: ProductCreate = {
      name: name.trim(),
      description: description.trim(),
      brand_id: brandId,
      price,
      category_id: categoryId,
      subcategory_id: subcategoryId,
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
            const firstSubCat = subcategory.find(sc => sc.category.id_category === e.detail.value);
            if (firstSubCat) {
              setSubcategoryId(firstSubCat.id_subcategory);
            } else {
              setSubcategoryId(0);
            }
          }}
        >
          {category.map((c) => (
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
          value={subcategoryId}
          onIonChange={(e) => setSubcategoryId(e.detail.value)}
          disabled={!categoryId}
        >
          {subcategory
            .map((sc) => (
              <IonSelectOption key={sc.id_subcategory} value={sc.id_subcategory}>
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
