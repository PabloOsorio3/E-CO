import type { OrderResponse } from "../../interface/order.interface";
import axiosInstance from "../instance/instance";

export const getMyOrders = async (): Promise<OrderResponse[]> => {
    const response = await axiosInstance.get(`/get_order`);
    return response.data;
};
