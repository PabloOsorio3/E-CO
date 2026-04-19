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
import { lockClosedOutline, mailOutline, storefrontOutline } from 'ionicons/icons';
import { loginApi as apiLogin } from '../../api/login/login.api';

import '../css/login.css';

import { showSuccessAlert } from '../../alerts/success/success-alert';
import { showErrorAlert } from '../../alerts/errorrs/error-alert';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await apiLogin({ email, password });
      console.log(response);
      showSuccessAlert('¡Inicio de sesión exitoso! Bienvenido.');
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

        <IonRow className="login-form">
          <IonInput
            label="Correo Electrónico"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="nombre@ejemplo.com"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value!)}
            className="custom-input"
          >
            <IonIcon slot="start" icon={mailOutline} aria-hidden="true" />
          </IonInput>

          <IonInput
            label="Contraseña"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Introduce tu contraseña"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value!)}
            className="custom-input"
          >
            <IonIcon slot="start" icon={lockClosedOutline} aria-hidden="true" />
            <IonInputPasswordToggle slot="end" color="medium" />
          </IonInput>

          <IonButton
            onClick={handleLogin}
            expand="block"
            className="login-button"
          >
            Iniciar Sesión
          </IonButton>

          <IonRow className="forgot-password">
            <IonButton fill="clear" size="small">
              ¿Olvidaste tu contraseña?
            </IonButton>
          </IonRow>
        </IonRow>
      </IonGrid>
    </IonPage>
  );
};

export default Login;