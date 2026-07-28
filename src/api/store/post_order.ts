import type { OrderCreate } from "../../interface/order.interface";
import axiosInstance from "../instance/instance";

export interface PostOrderResponse {
    message: string;
    order_id: number;
}

export const postOrder = async (data: OrderCreate): Promise<PostOrderResponse> => {
    const response = await axiosInstance.post(`/post_order`, data);
    return response.data;
};
