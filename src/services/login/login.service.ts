import { showErrorAlert } from "../../alerts/error/error-alert";
import { showSuccessAlert } from "../../alerts/success/success-alert";
import { getCurrentUser, setToken } from "../../core/current_user";

export const loginService = async (res: any) => {
    try {
        if (res.status === 200) {
            showSuccessAlert(res.message);
            setToken(res.token);

            const currentUser = getCurrentUser();

            if (currentUser?.type_user_id === 1) {
                window.location.href = '/admin/home';
                return true;
            }

            return res
        } else {
            showErrorAlert(res.message);
            return null;
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
    }
}