import type { SubCategoryResponse, SubCategoryCreate } from "../../../interface/subcategory.interface.ts";
import axiosInstance from "../../instance/instance.ts";

export const postSubCategory = async (data: SubCategoryCreate): Promise<SubCategoryResponse> => {
    const response = await axiosInstance.post(`/admin/post_subcategory`, data);
    return response.data;
};
