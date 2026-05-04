import React, { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { lockClosedOutline, mailOutline, storefrontOutline } from 'ionicons/icons';
import { loginApi as apiLogin } from '../../api/login/login.api';

import '../css/login.css';

import { showSuccessAlert } from '../../alerts/success/success-alert';
import { showErrorAlert } from '../../alerts/error/error-alert';

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiLogin({ email, password });
      console.log(response);
      showSuccessAlert('¡Inicio de sesión exitoso! Bienvenido.');
      history.push('/admin/home');
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      showErrorAlert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };
  return (
    <IonPage className="container-login">
      <IonGrid className="login-card">
        <IonRow className="logo-container">
          <IonCol className="logo-circle">
            <IonIcon icon={storefrontOutline} />
          </IonCol>
        </IonRow>

        <IonRow className="login-header">
          <IonCol>
            <h1>E-CO</h1>
            <p>Bienvenido de nuevo. Ingresa tus datos para continuar.</p>
          </IonCol>
        </IonRow>

        <form onSubmit={handleLogin} className="login-form-wrapper">
          <IonRow className="login-form">
            <IonInput
              label="Correo Electrónico"
              labelPlacement="floating"
              fill="outline"
              type="email"
              required
              placeholder="nombre@ejemplo.com"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              className="custom-input"
            >
              <IonIcon slot="start" icon={mailOutline} aria-hidden="true" />
            </IonInput>

            <IonInput
              label="Contraseña"
              labelPlacement="floating"
              fill="outline"
              type="password"
              required
              placeholder="Introduce tu contraseña"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              className="custom-input"
            >
              <IonIcon slot="start" icon={lockClosedOutline} aria-hidden="true" />
              <IonInputPasswordToggle slot="end" color="medium" />
            </IonInput>

            <IonButton
              type="submit"
              expand="block"
              className="login-button"
            >
              Iniciar Sesión
            </IonButton>
          </IonRow>
        </form>
      </IonGrid>
    </IonPage>
  );
};
export default Login;