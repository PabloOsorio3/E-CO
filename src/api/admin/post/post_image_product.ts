import apiInstance from '../../instance/instance';
import type { ImageProductResponse } from '../../../interface/image.interface';

export const postImageProduct = async (
    productId: number,
    file: File,
    isMain: boolean
): Promise<ImageProductResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_main', String(isMain));

    const response = await apiInstance.post(`/admin/post_image_product/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
