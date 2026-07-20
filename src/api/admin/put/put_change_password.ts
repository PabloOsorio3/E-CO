import apiInstance from '../../instance/instance';

export interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
}

// El backend todavía no expone este endpoint (ver HANDOFF_admin_profile.md
// en BACKEND-STORE) — la llamada fallará hasta que se implemente.
export const changePasswordApi = async (data: ChangePasswordPayload): Promise<{ message: string }> => {
    const response = await apiInstance.put('/put_change_password', data);
    return response.data;
};
