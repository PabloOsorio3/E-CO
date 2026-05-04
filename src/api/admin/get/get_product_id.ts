import axiosInstance from "../../instance/instance";
import type { ProductResponse } from "../../../interface/product.interface";


export const getProductById = async (id: number): Promise<ProductResponse> => {
  const response = await axiosInstance.get(`/get_product/${id}`);
  return response.data;
};