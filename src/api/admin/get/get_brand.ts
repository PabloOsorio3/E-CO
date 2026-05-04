import type { BrandResponse } from "../../../interface/brand.interface.ts";
import axiosInstance from "../../instance/instance.ts";

export const getBrands = async (): Promise<BrandResponse[]> => {
    try {
        const response = await axiosInstance.get(`/get_brand`);
        return response.data;
    } catch (error) {
        console.error('Error fetching brands:', error);
        throw error;
    }
}   