import type { ProductCreate, ProductResponse } from "../../../interface/product.interface";
import axiosInstance from "../../instance/instance";


export const createProduct = async (product: ProductCreate): Promise<ProductResponse> => {
    const response = await axiosInstance.post('/admin/post_product', product, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
};