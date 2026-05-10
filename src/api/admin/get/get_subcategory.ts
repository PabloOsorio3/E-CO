import type { SubCategoryResponse } from "../../../interface/subcategory.interface.ts";
import axiosInstance from "../../instance/instance";

export const getSubCategory = async (): Promise<SubCategoryResponse[]> => {
    const response = await axiosInstance.get(`/get_subcategory`);
    return response.data;
};