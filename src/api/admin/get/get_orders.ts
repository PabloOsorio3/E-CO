import type { OrderResponse } from "../../../interface/order.interface";
import axiosInstance from "../../instance/instance";

export const getOrders = async (): Promise<OrderResponse[]> => {
    const response = await axiosInstance.get('/admin/get_all_orders');
    return response.data;
};
