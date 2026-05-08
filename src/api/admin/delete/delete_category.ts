import apiInstance from '../../instance/instance';

export const deleteCategory = async (id: number): Promise<{ message: string }> => {
    const response = await apiInstance.delete(`/admin/delete_category/${id}`);
    return response.data;
};
