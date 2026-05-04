import type { ProductUpdate, ProductResponse } from "../../../interface/product.interface";
import axiosInstance from "../../instance/instance";


export const updateProduct = async (id: number, product: ProductUpdate): Promise<ProductResponse> => {
    const response = await axiosInstance.put(`admin/put_product/${id}`, product);
    return response.data;
};