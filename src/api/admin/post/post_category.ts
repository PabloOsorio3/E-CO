import apiInstance from '../../instance/instance';
import type { CategoryCreate, CategoryResponse } from '../../../interface/category.interface';

export const postCategory = async (data: CategoryCreate): Promise<CategoryResponse> => {
    const response = await apiInstance.post('/admin/post_category', data);
    return response.data;
};
