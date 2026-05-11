import apiInstance from '../../instance/instance';
import type { StatusCreate, StatusResponse } from '../../../interface/status.interface';

export const postStatus = async (data: StatusCreate): Promise<StatusResponse> => {
    const response = await apiInstance.post('/admin/post_status', data);
    return response.data;
};
