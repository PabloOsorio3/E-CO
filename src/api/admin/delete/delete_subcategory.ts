import axiosInstance from "../../instance/instance";

export const deleteSubCategory = async (id_subcategory: number): Promise<void> => {
    await axiosInstance.delete(`/delete_subcategory/${id_subcategory}`);
};
