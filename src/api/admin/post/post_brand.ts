import apiInstance from '../../instance/instance';
import type { BrandCreate, BrandResponse } from '../../../interface/brand.interface';

export const postBrand = async (data: BrandCreate): Promise<BrandResponse> => {
    const response = await apiInstance.post('/admin/post_brand', data);
    return response.data;
};
