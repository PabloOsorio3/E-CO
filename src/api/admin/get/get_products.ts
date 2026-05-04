import type { ProductResponse } from "../../../interface/product.interface";
import axiosInstance from "../../instance/instance";

export const getProducts = async (): Promise<ProductResponse[]> => {
    const response = await axiosInstance.get(`/get_products`);
    return response.data;
};