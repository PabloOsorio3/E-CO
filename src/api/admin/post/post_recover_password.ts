import apiInstance from '../../instance/instance';

export interface RecoverPasswordPayload {
    password: string;
}

export const recoverPasswordApi = async (data: RecoverPasswordPayload): Promise<{ message: string }> => {
    const response = await apiInstance.post('/post_recover_password', data);
    return response.data;
};
