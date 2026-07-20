import apiInstance from '../../instance/instance';
import type { CustomerCreate, CustomerResponse } from '../../../interface/customer.interface';

export const postCustomer = async (data: CustomerCreate): Promise<CustomerResponse> => {
    const response = await apiInstance.post('/admin/post_customer', data);
    return response.data;
};
