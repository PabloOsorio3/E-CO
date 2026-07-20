import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react';
import {
  personCircleOutline,
  copyOutline,
  logoGoogle,
  logoFacebook,
  logoTwitter,
  addCircleOutline,
  eyeOffOutline,
  createOutline,
  shareSocialOutline,
  cardOutline,
  calendarOutline,
  cloudUploadOutline,
} from 'ionicons/icons';
import { PageHeader } from '../../../components/shared';
import { getCurrentUser } from '../../../core/current_user';
import { changePasswordApi } from '../../../api/admin/put/put_change_password';
import { showSuccessAlert } from '../../../alerts/success/success-alert';
import { showErrorAlert } from '../../../alerts/error/error-alert';
import { showInfoAlert } from '../../../alerts/info/info-alert';
import '../../css/profile.css';

const notAvailable = () => showInfoAlert('Función no disponible todavía');

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();
  const fullName = currentUser?.full_name ?? '';
  const email = currentUser?.email ?? '';
  const [firstName, lastName] = fullName ? fullName.split(' ', 2) : ['', ''];

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleCopyEmail = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    showSuccessAlert('Correo copiado al portapapeles');
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showErrorAlert('Completa los tres campos de contraseña');
      return;
    }
    if (newPassword !== confirmPassword) {
      showErrorAlert('Las contraseñas nuevas no coinciden');
      return;
    }
    setSavingPassword(true);
    try {
      await changePasswordApi({ current_password: currentPassword, new_password: newPassword });
      showSuccessAlert('Contraseña actualizada exitosamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      showErrorAlert(error.response?.data?.detail || 'Error al cambiar la contraseña');
    } finally {
      setSavingPassword(false);
    }
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
                <button className="profile-icon-btn" title="Editar" onClick={notAvailable}>
                  <IonIcon icon={createOutline} />
                </button>
                <button className="profile-icon-btn" title="Compartir" onClick={notAvailable}>
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

                <p className="profile-social-label">Linked with Social media</p>
                <div className="profile-social-row">
                  <span className="profile-social-item"><IonIcon icon={logoGoogle} /> Sin vincular</span>
                  <span className="profile-social-item"><IonIcon icon={logoFacebook} /> Sin vincular</span>
                  <span className="profile-social-item"><IonIcon icon={logoTwitter} /> Sin vincular</span>
                </div>
                <button className="profile-add-social" onClick={notAvailable}>
                  <IonIcon icon={addCircleOutline} /> Social media
                </button>
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
                    placeholder="Enter password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <IonIcon icon={eyeOffOutline} />
                </div>
              </div>

              <p className="profile-field-hint" onClick={notAvailable} style={{ cursor: 'pointer' }}>
                Forgot Current Password? Click here
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
              <IonButton fill="outline" size="small" className="profile-btn-outline" onClick={notAvailable}>
                <IonIcon icon={createOutline} slot="start" />
                Edit
              </IonButton>
            </div>
            <h2>Profile Update</h2>

            <div className="profile-update-header">
              <div className="profile-update-avatar">
                <IonIcon icon={personCircleOutline} />
              </div>
              <div className="profile-update-actions">
                <IonButton className="profile-btn-filled" onClick={notAvailable}>
                  <IonIcon icon={cloudUploadOutline} slot="start" />
                  Upload New
                </IonButton>
                <IonButton className="profile-btn-outline" fill="outline" onClick={notAvailable}>
                  Delete
                </IonButton>
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
                <label>Password</label>
                <div className="profile-field-input">
                  <input value="••••••••••" readOnly />
                  <IonIcon icon={eyeOffOutline} />
                </div>
              </div>
              <div className="profile-field">
                <label>Phone Number</label>
                <div className="profile-field-input">
                  <input readOnly placeholder="Sin teléfono registrado" />
                </div>
              </div>

              <div className="profile-field">
                <label>E-mail</label>
                <div className="profile-field-input">
                  <input value={email} readOnly placeholder="Sin correo registrado" />
                </div>
              </div>
              <div className="profile-field">
                <label>Date of Birth</label>
                <div className="profile-field-input">
                  <input readOnly placeholder="No disponible" />
                  <IonIcon icon={calendarOutline} />
                </div>
              </div>

              <div className="profile-field full-width">
                <label>Location</label>
                <div className="profile-field-input">
                  <input readOnly placeholder="Sin dirección registrada" />
                </div>
              </div>

              <div className="profile-field full-width">
                <label>Credit Card</label>
                <div className="profile-field-input">
                  <IonIcon icon={cardOutline} />
                  <input readOnly placeholder="No disponible" />
                </div>
              </div>

              <div className="profile-field full-width">
                <label>Biography</label>
                <div className="profile-field-input is-textarea">
                  <textarea readOnly rows={4} placeholder="No disponible" />
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
