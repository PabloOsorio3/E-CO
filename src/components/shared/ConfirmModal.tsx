import React from 'react';
import { IonModal, IonButton, IonIcon, IonCard } from '@ionic/react';
import { alertCircleOutline, trashOutline, warningOutline } from 'ionicons/icons';
import './shared.css';

type ConfirmVariant = 'danger' | 'warning' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

const variantConfig: Record<ConfirmVariant, { icon: string; btnClass: string }> = {
  danger: { icon: trashOutline, btnClass: 'btn-confirm-danger' },
  warning: { icon: warningOutline, btnClass: 'btn-confirm-warning' },
  info: { icon: alertCircleOutline, btnClass: 'btn-confirm-primary' },
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) => {
  const config = variantConfig[variant];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="confirm-modal">
      <IonCard className="confirm-modal-content">
        <IonCard className={`confirm-modal-icon confirm-modal-icon--${variant}`}>
          <IonIcon icon={config.icon} />
        </IonCard>
        <h2>{title}</h2>
        <p>{message}</p>
        <IonCard className="confirm-modal-actions">
          <IonButton expand="block" className="btn-cancel" onClick={onClose}>
            {cancelText}
          </IonButton>
          <IonButton expand="block" className={config.btnClass} onClick={handleConfirm}>
            {confirmText}
          </IonButton>
        </IonCard>
      </IonCard>
    </IonModal>
  );
};

export default ConfirmModal;
