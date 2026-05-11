import apiInstance from '../../instance/instance';

export const deleteStatusApi = async (id_status: number): Promise<any> => {
    const response = await apiInstance.delete(`/admin/delete_status/${id_status}`);
    return response.data;
};
