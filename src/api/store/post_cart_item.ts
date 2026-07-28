import type { CartItemCreate } from "../../interface/cart.interface";
import axiosInstance from "../instance/instance";

export const postCartItem = async (data: CartItemCreate) => {
    const response = await axiosInstance.post(`/post_shoppingcart_item`, data);
    return response.data;
};
