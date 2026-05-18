import type { OrderStatusUpdate } from "../../../interface/order.interface";
import axiosInstance from "../../instance/instance";

export const updateOrderStatus = async (id_order: number, data: OrderStatusUpdate): Promise<any> => {
    const response = await axiosInstance.put(`/admin/put_order_status/${id_order}`, data);
    return response.data;
};
