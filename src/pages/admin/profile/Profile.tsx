import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react';
import {
  personCircleOutline,
  copyOutline,
  eyeOffOutline,
  createOutline,
  shareSocialOutline,
} from 'ionicons/icons';
import { PageHeader } from '../../../components/shared';
import { getCurrentUser } from '../../../core/current_user';
import { changePasswordApi } from '../../../api/admin/put/put_change_password';
import { recoverPasswordApi } from '../../../api/admin/post/post_recover_password';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMyDataThunk, updateMyDataThunk } from '../../../store/slices/dataUser.slice';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';
import '../../css/profile.css';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = getCurrentUser();
  const fullName = currentUser?.full_name ?? '';
  const email = currentUser?.email ?? '';
  const [firstName, lastName] = fullName ? fullName.split(' ', 2) : ['', ''];

  const { data: myData, saving } = useAppSelector((state) => state.dataUser);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [addressInput, setAddressInput] = useState('');

  useEffect(() => {
    dispatch(fetchMyDataThunk());
  }, [dispatch]);

  const handleStartEdit = () => {
    setPhoneInput(myData?.phone ?? '');
    setAddressInput(myData?.address ?? '');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateMyDataThunk({ phone: phoneInput, address: addressInput })).unwrap();
      showSuccessAlert('Perfil actualizado exitosamente');
      setIsEditingProfile(false);
    } catch (error: any) {
      showErrorAlert(error || 'Error al guardar el perfil');
    }
  };

  const handleCopyEmail = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    showSuccessAlert('Correo copiado al portapapeles');
  };

  const handleToggleForgotMode = () => {
    if (!forgotMode) setCurrentPassword('');
    setForgotMode(!forgotMode);
  };

  const handleChangePassword = async () => {
    if (!forgotMode && !currentPassword) {
      showErrorAlert('Completa los tres campos de contraseña');
      return;
    }
    if (!newPassword || !confirmPassword) {
      showErrorAlert('Completa los tres campos de contraseña');
      return;
    }
    if (newPassword !== confirmPassword) {
      showErrorAlert('Las contraseñas nuevas no coinciden');
      return;
    }
    setSavingPassword(true);
    try {
      if (forgotMode) {
        await recoverPasswordApi({ password: newPassword });
      } else {
        await changePasswordApi({ current_password: currentPassword, new_password: newPassword });
      }
      showSuccessAlert('Contraseña actualizada exitosamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setForgotMode(false);
    } catch (error: any) {
      showErrorAlert(error.response?.data?.detail || 'Error al cambiar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleShareProfile = async () => {
    const shareText = [fullName, email].filter(Boolean).join(' — ');
    if (!shareText) {
      showErrorAlert('No hay datos de perfil para compartir');
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Perfil E-CO', text: shareText });
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          showErrorAlert('No se pudo compartir el perfil');
        }
      }
      return;
    }
    await navigator.clipboard.writeText(shareText);
    showSuccessAlert('Datos del perfil copiados al portapapeles');
  };

  return (
    <IonPage>
      <PageHeader title="Admin role" subtitle="Perfil del administrador" />
      <IonContent className="profile-page">
        <div className="profile-grid">
          <div className="profile-left-column">
            {/* Profile summary card */}
            <div className="profile-page-card">
              <div className="profile-page-card-actions">
                <button className="profile-icon-btn" title="Editar" onClick={handleStartEdit}>
                  <IonIcon icon={createOutline} />
                </button>
                <button className="profile-icon-btn" title="Compartir" onClick={handleShareProfile}>
                  <IonIcon icon={shareSocialOutline} />
                </button>
              </div>

              <div className="profile-summary">
                <div className="profile-avatar-circle">
                  <IonIcon icon={personCircleOutline} />
                </div>
                <p className="profile-summary-name">{fullName || 'Sin nombre registrado'}</p>
                <div className="profile-summary-email-row">
                  <span>{email || 'Sin correo registrado'}</span>
                  {email && (
                    <button onClick={handleCopyEmail} title="Copiar correo">
                      <IonIcon icon={copyOutline} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Change password card */}
            <div className="profile-page-card">
              <h2>Change Password</h2>

              <div className="profile-field">
                <label>Current Password</label>
                <div className="profile-field-input">
                  <input
                    type="password"
                    placeholder={forgotMode ? 'No es necesaria' : 'Enter password'}
                    value={currentPassword}
                    disabled={forgotMode}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <IonIcon icon={eyeOffOutline} />
                </div>
              </div>

              <p className="profile-field-hint" onClick={handleToggleForgotMode} style={{ cursor: 'pointer' }}>
                {forgotMode ? 'Sí recuerdo mi contraseña actual' : 'Forgot Current Password? Click here'}
              </p>

              <div className="profile-field">
                <label>New Password</label>
                <div className="profile-field-input">
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <IonIcon icon={eyeOffOutline} />
                </div>
              </div>

              <div className="profile-field">
                <label>Re-enter Password</label>
                <div className="profile-field-input">
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <IonIcon icon={eyeOffOutline} />
                </div>
              </div>

              <IonButton className="profile-save-btn" onClick={handleChangePassword} disabled={savingPassword}>
                {savingPassword ? 'Guardando...' : 'Save Change'}
              </IonButton>
            </div>
          </div>

          {/* Profile update card */}
          <div className="profile-page-card">
            <div className="profile-page-card-actions" style={{ top: 20 }}>
              {isEditingProfile ? (
                <IonButton fill="outline" size="small" className="profile-btn-outline" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Guardando...' : 'Save'}
                </IonButton>
              ) : (
                <IonButton fill="outline" size="small" className="profile-btn-outline" onClick={handleStartEdit}>
                  <IonIcon icon={createOutline} slot="start" />
                  Edit
                </IonButton>
              )}
            </div>
            <h2>Profile Update</h2>

            <div className="profile-update-header">
              <div className="profile-update-avatar">
                <IonIcon icon={personCircleOutline} />
              </div>
            </div>

            <div className="profile-fields-grid">
              <div className="profile-field">
                <label>First Name</label>
                <div className="profile-field-input">
                  <input value={firstName} readOnly placeholder="Sin nombre registrado" />
                </div>
              </div>
              <div className="profile-field">
                <label>Last Name</label>
                <div className="profile-field-input">
                  <input value={lastName} readOnly placeholder="Sin apellido registrado" />
                </div>
              </div>

              <div className="profile-field">
                <label>Phone Number</label>
                <div className="profile-field-input">
                  {isEditingProfile ? (
                    <input
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="Ej: 3001234567"
                    />
                  ) : (
                    <input value={myData?.phone ?? ''} readOnly placeholder="Sin teléfono registrado" />
                  )}
                </div>
              </div>
              <div className="profile-field">
                <label>E-mail</label>
                <div className="profile-field-input">
                  <input value={email} readOnly placeholder="Sin correo registrado" />
                </div>
              </div>

              <div className="profile-field full-width">
                <label>Location</label>
                <div className="profile-field-input">
                  {isEditingProfile ? (
                    <input
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      placeholder="Ej: Calle 10 # 20-30, Bogotá"
                    />
                  ) : (
                    <input value={myData?.address ?? ''} readOnly placeholder="Sin dirección registrada" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
