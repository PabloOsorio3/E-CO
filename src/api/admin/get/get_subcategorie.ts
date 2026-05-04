import type { SubCategorieResponse } from "../../../interface/subcategorie.interface.ts";
import axiosInstance from "../../instance/instance";

export const getSubCategories = async (): Promise<SubCategorieResponse[]> => {
    const response = await axiosInstance.get(`/get_subcategories`);
    return response.data;
};