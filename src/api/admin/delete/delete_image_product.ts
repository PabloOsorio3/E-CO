import apiInstance from '../../instance/instance';

export const deleteImageProduct = async (idImage: number): Promise<{ message: string }> => {
    const response = await apiInstance.delete(`/admin/delete_image_product/${idImage}`);
    return response.data;
};
