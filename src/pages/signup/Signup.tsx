import React, { useState, useEffect } from "react";
import {
    IonButton,
    IonInput,
    IonPage,
    IonContent,
    IonIcon,
    IonSpinner,
    IonSelect,
    IonSelectOption,
    IonInputPasswordToggle,
} from '@ionic/react';
import {
    mailOutline,
    lockClosedOutline,
    checkmarkCircleOutline,
    leafOutline,
    personCircleOutline,
} from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchTypeUser } from '../../store/slices/typeuser.slice';
import { signup } from "../../store/slices/signup.slice.ts";
import '../css/signup.css';
import { showSuccessAlert } from "../../alerts/success/success-alert.ts";
import { showErrorAlert } from "../../alerts/error/error-alert.ts";
import { showInfoAlert } from "../../alerts/info/info-alert.ts";

const Signup = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: typeUsers, loading: loadingTypes } = useSelector(
        (state: RootState) => state.typeuser
    );

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [typeUserId, setTypeUserId] = useState<number | undefined>(undefined);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    useEffect(() => {
        dispatch(fetchTypeUser());
    }, [dispatch]);

    const handleBlurConfirmPassword = (confirmVal: string, passwordVal: string) => {
        if (passwordVal && confirmVal) {
            setPasswordsMatch(passwordVal === confirmVal);
        } else {
            setPasswordsMatch(true);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordsMatch) {
            showErrorAlert("Las contraseñas no coinciden");
            return;
        }

        if (!typeUserId) {
            showErrorAlert("Por favor, selecciona un tipo de usuario");
            return;
        }

        setIsLoading(true);
        try {
            const resultAction = await dispatch(signup({
                email,
                type_user_id: typeUserId,
                password,
                confirm_password: confirmPassword
            }));

            if (signup.rejected.match(resultAction)) {
                if (resultAction.error?.code === "ERR_BAD_REQUEST") {
                    showInfoAlert("Límite de peticiones alcanzado, espere un momento");
                } else {
                    showErrorAlert(resultAction.payload?.message || "Ocurrió un error inesperado");
                }
                return;
            }

            if (signup.fulfilled.match(resultAction)) {
                const payload = resultAction.payload;

                if (payload?.status !== 201) {
                    showErrorAlert(payload?.message);
                } else {
                    showSuccessAlert(payload?.message);
                }
            }

        } catch (error) {
            console.error("Error grave en el flujo de registro: ", error);
            showErrorAlert("Hubo un problema de conexión con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <IonPage>
            <IonContent className="signup-content">
                <div className="signup-container">
                    <div className="signup-card">

                        {/* Logo */}
                        <div className="signup-logo">
                            <div className="signup-logo-circle">
                                <IonIcon icon={leafOutline} />
                            </div>
                        </div>

                        {/* Header */}
                        <div className="signup-header">
                            <h1>Crear cuenta</h1>
                            <p>Únete a E-CO y empieza hoy</p>
                        </div>

                        {/* Form */}
                        <form className="signup-form" onSubmit={handleRegister}>

                            <IonInput
                                className="signup-input"
                                labelPlacement="floating"
                                label="Correo electrónico"
                                placeholder="correo@ejemplo.com"
                                type="email"
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value!)}
                                disabled={isLoading}
                                required
                            >
                                <IonIcon slot="start" icon={mailOutline} />
                            </IonInput>

                            {/* Tipo de usuario */}
                            <div className="signup-select-wrapper">
                                <IonIcon icon={personCircleOutline} className="signup-select-icon" />
                                <IonSelect
                                    className="signup-select"
                                    value={typeUserId}
                                    onIonChange={(e) => setTypeUserId(e.detail.value)}
                                    placeholder={loadingTypes ? "Cargando..." : "Tipo de usuario"}
                                    disabled={isLoading || loadingTypes}
                                    interface="popover"
                                >
                                    {typeUsers?.map((tu) => (
                                        <IonSelectOption key={tu.id_type_user} value={tu.id_type_user}>
                                            {tu.name}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </div>

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
                                disabled={isLoading}
                            >
                                <IonIcon slot="start" icon={lockClosedOutline} aria-hidden="true" />
                                <IonInputPasswordToggle slot="end" color="medium" />
                            </IonInput>

                            <IonInput
                                className={`signup-input ${!passwordsMatch ? 'ion-touched ion-invalid' : ''}`}
                                labelPlacement="floating"
                                label="Confirmar contraseña"
                                placeholder="••••••••"
                                type="password"
                                required
                                value={confirmPassword}
                                onIonChange={(e) => {
                                    const val = e.detail.value!;
                                    setConfirmPassword(val);
                                    if (password === val) setPasswordsMatch(true);
                                }}
                                disabled={isLoading}
                                errorText={!passwordsMatch ? "Las contraseñas no coinciden" : undefined}
                                onIonBlur={() => handleBlurConfirmPassword(confirmPassword, password)}
                            >
                                <IonIcon slot="start" icon={lockClosedOutline} />
                                <IonInputPasswordToggle slot="end" color="medium" />
                            </IonInput>

                            <IonButton
                                type="submit"
                                expand="block"
                                className="signup-button"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <IonSpinner name="crescent" slot="start" />
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        Registrarse
                                        <IonIcon slot="end" icon={checkmarkCircleOutline} />
                                    </>
                                )}
                            </IonButton>
                        </form>

                        {/* Footer link */}
                        <div className="signup-footer">
                            <span>¿Ya tienes cuenta?</span>
                            <IonButton fill="clear" routerLink="/login" className="signup-link">
                                Inicia sesión
                            </IonButton>
                        </div>

                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Signup;