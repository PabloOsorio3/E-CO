import type { BrandUpdate, BrandResponse } from "../../../interface/brand.interface";
import axiosInstance from "../../instance/instance";

export const updateBrandApi = async (id: number, brand: BrandUpdate): Promise<BrandResponse> => {
    const response = await axiosInstance.put(`/admin/put_brand/${id}`, brand);
    return response.data;
};
