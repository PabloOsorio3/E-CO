import type { CartItemResponse } from "../../interface/cart.interface";
import axiosInstance from "../instance/instance";

export const getCart = async (): Promise<CartItemResponse[]> => {
    const response = await axiosInstance.get(`/get_shoppingcart`);
    return response.data;
};
