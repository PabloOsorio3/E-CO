import React, { useEffect, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { arrowBackOutline, createOutline, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { getCurrentUser } from '../../../core/current_user';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMyDataThunk, updateMyDataThunk } from '../../../store/slices/dataUser.slice';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';

const Account: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const currentUser = getCurrentUser();
    const email = currentUser?.email ?? '';
    const fullName = currentUser?.full_name ?? '';

    const { data: myData, loading, saving } = useAppSelector((state) => state.dataUser);

    const [isEditing, setIsEditing] = useState(false);
    const [phoneInput, setPhoneInput] = useState('');
    const [addressInput, setAddressInput] = useState('');

    useEffect(() => {
        dispatch(fetchMyDataThunk());
    }, [dispatch]);

    const handleStartEdit = () => {
        setPhoneInput(myData?.phone ?? '');
        setAddressInput(myData?.address ?? '');
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await dispatch(updateMyDataThunk({ phone: phoneInput, address: addressInput })).unwrap();
            showSuccessAlert('Datos actualizados exitosamente');
            setIsEditing(false);
        } catch (error: any) {
            showErrorAlert(error || 'Error al guardar los datos');
        }
    };

    return (
        <div className="store-page">
            <button className="store-back-link" onClick={() => history.push('/store/catalog')}>
                <IonIcon icon={arrowBackOutline} />
                Seguir comprando
            </button>

            <h1>Mi Cuenta</h1>

            <div className="store-account-card">
                <div className="store-account-header">
                    <div className="store-account-avatar">
                        <IonIcon icon={personCircleOutline} />
                    </div>
                    <div className="store-account-header-info">
                        <span className="store-account-name">{fullName || 'Sin nombre registrado'}</span>
                        <span className="store-account-email">{email}</span>
                    </div>
                    {!isEditing && (
                        <button className="store-account-edit-btn" onClick={handleStartEdit}>
                            <IonIcon icon={createOutline} />
                            Editar
                        </button>
                    )}
                </div>

                {loading && !myData ? (
                    <p className="customer-overview-empty">Cargando tus datos...</p>
                ) : (
                    <div className="store-account-fields">
                        <div className="store-account-field">
                            <label>Teléfono</label>
                            {isEditing ? (
                                <input
                                    value={phoneInput}
                                    onChange={(e) => setPhoneInput(e.target.value)}
                                    placeholder="Ej: 3001234567"
                                />
                            ) : (
                                <span>{myData?.phone || 'Sin teléfono registrado'}</span>
                            )}
                        </div>

                        <div className="store-account-field">
                            <label>Dirección</label>
                            {isEditing ? (
                                <input
                                    value={addressInput}
                                    onChange={(e) => setAddressInput(e.target.value)}
                                    placeholder="Ej: Calle 10 # 20-30, Bogotá"
                                />
                            ) : (
                                <span>{myData?.address || 'Sin dirección registrada'}</span>
                            )}
                        </div>

                        {isEditing && (
                            <div className="store-account-actions">
                                <button className="store-account-cancel-btn" onClick={() => setIsEditing(false)}>
                                    Cancelar
                                </button>
                                <button className="store-checkout-btn" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;
