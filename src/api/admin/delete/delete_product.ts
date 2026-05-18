import type { ProductResponse } from "../../../interface/product.interface";
import axiosInstance from "../../instance/instance";

export const deleteProduct = async (id: number): Promise<ProductResponse> => {
    const response = await axiosInstance.get(`/admin/delete_product/${id}`);
    return response.data;
};
