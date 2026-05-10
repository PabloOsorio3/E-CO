import apiInstance from '../../instance/instance';
import type { BrandResponse } from '../../../interface/brand.interface';

export const deleteBrandApi = async (id_brand: number): Promise<BrandResponse> => {
    const response = await apiInstance.delete(`/admin/delete_brand/${id_brand}`);
    return response.data;
};
