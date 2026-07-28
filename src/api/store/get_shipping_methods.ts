import type { ShippingMethodResponse } from "../../interface/shipping.interface";
import axiosInstance from "../instance/instance";

export const getShippingMethods = async (): Promise<ShippingMethodResponse[]> => {
    const response = await axiosInstance.get(`/get_shipping_method`);
    return response.data;
};
