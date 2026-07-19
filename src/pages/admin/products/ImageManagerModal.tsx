import React, { useEffect, useRef, useState } from 'react';
import { IonModal, IonButton, IonIcon, IonCheckbox, IonText } from '@ionic/react';
import { closeOutline, trashOutline, cloudUploadOutline } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchImagesThunk, uploadImageThunk, deleteImageThunk, clearImages } from '../../../store/slices/image.slice';
import type { ProductResponse } from '../../../interface/product.interface';
import { STATIC_BASE_URL } from '../../../api/instance/instance';
import { ConfirmModal } from '../../../components/shared';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';
import '../../css/products.css';

interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductResponse | null;
}

const ImageManagerModal: React.FC<ImageManagerModalProps> = ({ isOpen, onClose, product }) => {
  const dispatch = useAppDispatch();
  const { items: images, loading } = useAppSelector((state) => state.images);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isMain, setIsMain] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      dispatch(fetchImagesThunk(product.id_product));
    }
    if (!isOpen) {
      dispatch(clearImages());
    }
  }, [isOpen, product, dispatch]);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !product) return;
    try {
      await dispatch(uploadImageThunk({ productId: product.id_product, file, isMain })).unwrap();
      showSuccessAlert('Imagen subida exitosamente');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsMain(false);
    } catch (error: any) {
      showErrorAlert(error || 'Error al subir la imagen');
    }
  };

  const handleDeleteRequest = (idImage: number) => {
    setDeletingImageId(idImage);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
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
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="product-modal" breakpoints={[0, 1]} initialBreakpoint={1}>
      <div className="modal-header">
        <h2>Imágenes {product ? `— ${product.name}` : ''}</h2>
        <IonButton fill="clear" onClick={onClose}>
          <IonIcon icon={closeOutline} />
        </IonButton>
      </div>

      <div className="modal-body">
        {loading && images.length === 0 ? (
          <IonText color="medium"><p>Cargando imágenes...</p></IonText>
        ) : images.length === 0 ? (
          <IonText color="medium"><p>Este producto todavía no tiene imágenes.</p></IonText>
        ) : (
          <div className="image-manager-grid">
            {images.map((img) => (
              <div key={img.id_image} className="image-manager-thumb">
                <img src={`${STATIC_BASE_URL}${img.url_image}`} alt={product?.name ?? 'Producto'} />
                {img.is_main && <span className="image-manager-main-badge">Principal</span>}
                <button
                  className="image-manager-delete-btn"
                  title="Eliminar imagen"
                  onClick={() => handleDeleteRequest(img.id_image)}
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
          <IonButton className="btn-save" onClick={handleUpload} disabled={loading}>
            <IonIcon icon={cloudUploadOutline} slot="start" />
            Subir
          </IonButton>
        </div>
      </div>

      <div className="modal-footer">
        <IonButton expand="block" className="btn-modal-cancel" onClick={onClose}>
          Cerrar
        </IonButton>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingImageId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar imagen?"
        message="La imagen será eliminada permanentemente. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="danger"
      />
    </IonModal>
  );
};

export default ImageManagerModal;
