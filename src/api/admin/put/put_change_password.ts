import apiInstance from '../../instance/instance';

export interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
}

export const changePasswordApi = async (data: ChangePasswordPayload): Promise<{ message: string }> => {
    const response = await apiInstance.put('/put_change_password', data);
    return response.data;
};
