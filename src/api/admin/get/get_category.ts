import axiosInstance from "../../instance/instance";
import type { CategoryResponse } from "../../../interface/category.interface";


export const getCategory = async (): Promise<CategoryResponse[]> => {
    const response = await axiosInstance.get(`/get_category`);

    return response.data;
};