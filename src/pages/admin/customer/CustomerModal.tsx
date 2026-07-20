import React, { useState } from 'react';
import {
  IonModal,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonText,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import type { CustomerCreate, CustomerResponse, CustomerUpdate } from '../../../interface/customer.interface';
import type { AdminUserResponse } from '../../../interface/user.interface';

import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCreate: (data: CustomerCreate) => void;
  onSaveEdit: (data: CustomerUpdate) => void;

  customer?: CustomerResponse | null;
  eligibleUsers: AdminUserResponse[];
  loading?: boolean;
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSaveCreate,
  onSaveEdit,
  customer,
  eligibleUsers,
  loading = false,
}) => {
  const isEditing = !!customer;

  // El componente se remonta (via `key` en el padre) cada vez que se abre,
  // por lo que el estado inicial se calcula una sola vez.
  const [userId, setUserId] = useState<number | undefined>(() => eligibleUsers[0]?.id_user);
  const [statusId, setStatusId] = useState<number>(() => customer?.status_id ?? 1);

  const status = useSelector((state: RootState) => state.status.items);

  const handleSave = () => {
    if (isEditing) {
      onSaveEdit({ status_id: statusId });
      return;
    }
    if (!userId) return;
    onSaveCreate({ user_id: userId, status_id: statusId });
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="product-modal" breakpoints={[0, 1]} initialBreakpoint={1}>
      <div className="modal-header">
        <h2>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
        <IonButton fill="clear" onClick={onClose}>
          <IonIcon icon={closeOutline} />
        </IonButton>
      </div>

      <div className="modal-body">
        {isEditing ? (
          <>
            <IonText>
              <p><strong>{customer?.name ?? `Usuario #${customer?.user_id}`}</strong></p>
              <p>{customer?.email ?? 'Sin correo registrado'}</p>
            </IonText>
          </>
        ) : eligibleUsers.length === 0 ? (
          <IonText color="medium">
            <p>No hay usuarios con rol Cliente disponibles para vincular (ya son todos clientes, o no hay usuarios registrados con ese rol).</p>
          </IonText>
        ) : (
          <IonSelect
            className="form-select"
            label="Usuario"
            labelPlacement="floating"
            fill="outline"
            value={userId}
            onIonChange={(e) => setUserId(e.detail.value)}
          >
            {eligibleUsers.map((u) => (
              <IonSelectOption key={u.id_user} value={u.id_user}>
                {u.email}
              </IonSelectOption>
            ))}
          </IonSelect>
        )}

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
        <IonButton
          expand="block"
          className="btn-save"
          onClick={handleSave}
          disabled={loading || (!isEditing && !userId)}
        >
          {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Cliente'}
        </IonButton>
      </div>
    </IonModal>
  );
};

export default CustomerModal;
