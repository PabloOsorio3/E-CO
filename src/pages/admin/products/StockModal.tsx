import React, { useState } from 'react';
import {
  IonModal,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonText,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import type { InventoryMovementCreate } from '../../../interface/inventory.interface';
import type { ProductResponse } from '../../../interface/product.interface';
import '../../css/products.css';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InventoryMovementCreate) => void;
  product: ProductResponse | null;
  loading?: boolean;
}

const StockModal: React.FC<StockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  loading = false,
}) => {
  const [type, setType] = useState<'entrada' | 'salida'>('entrada');
  const [quantity, setQuantity] = useState<number>(1);
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!product) return;
    onSave({
      product_id: product.id_product,
      type,
      quantity,
      description: description.trim(),
    });
  };

  const canSave = !!product && quantity > 0 && description.trim().length > 0;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="product-modal" breakpoints={[0, 1]} initialBreakpoint={1}>
      <div className="modal-header">
        <h2>Ajustar Stock</h2>
        <IonButton fill="clear" onClick={onClose}>
          <IonIcon icon={closeOutline} />
        </IonButton>
      </div>

      <div className="modal-body">
        {product && (
          <IonText>
            <p><strong>{product.name}</strong> — stock actual: {product.stock}</p>
          </IonText>
        )}

        <IonSelect
          className="form-select"
          label="Tipo de movimiento"
          labelPlacement="floating"
          fill="outline"
          value={type}
          onIonChange={(e) => setType(e.detail.value)}
        >
          <IonSelectOption value="entrada">Entrada</IonSelectOption>
          <IonSelectOption value="salida">Salida</IonSelectOption>
        </IonSelect>

        <IonInput
          className="form-input"
          label="Cantidad"
          labelPlacement="floating"
          fill="outline"
          type="number"
          min={1}
          value={quantity}
          onIonInput={(e) => setQuantity(parseInt(e.detail.value ?? '0', 10) || 0)}
        />

        <IonInput
          className="form-input"
          label="Motivo"
          labelPlacement="floating"
          fill="outline"
          value={description}
          onIonInput={(e) => setDescription(e.detail.value ?? '')}
          placeholder="Ej: Reposición de proveedor"
        />
      </div>

      <div className="modal-footer">
        <IonButton expand="block" className="btn-modal-cancel" onClick={onClose}>
          Cancelar
        </IonButton>
        <IonButton expand="block" className="btn-save" onClick={handleSave} disabled={loading || !canSave}>
          {loading ? 'Guardando...' : 'Registrar Movimiento'}
        </IonButton>
      </div>
    </IonModal>
  );
};

export default StockModal;
