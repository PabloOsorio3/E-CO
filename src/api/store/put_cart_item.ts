import type { CartItemUpdate } from "../../interface/cart.interface";
import axiosInstance from "../instance/instance";

export const putCartItem = async (id: number, data: CartItemUpdate) => {
    const response = await axiosInstance.put(`/put_shopping_cart_item/${id}`, data);
    return response.data;
};
