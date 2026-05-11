import apiInstance from '../../instance/instance';
import type { StatusUpdate, StatusResponse } from '../../../interface/status.interface';

export const updateStatusApi = async (id: number, data: StatusUpdate): Promise<StatusResponse> => {
    const response = await apiInstance.put(`/admin/put_status/${id}`, data);
    return response.data;
};
