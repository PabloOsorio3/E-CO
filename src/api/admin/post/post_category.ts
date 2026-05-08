import apiInstance from '../../instance/instance';
import type { CategoryCreate } from '../../../interface/category.interface';

export const postCategory = async (data: CategoryCreate): Promise<CategoryCreate> => {
    const response = await apiInstance.post('/admin/post_category', data);
    return response.data;
};
