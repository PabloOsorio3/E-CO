import apiInstance from "../../instance/instance";

export const deletePromotion = async (id: number) => {
    const response = await apiInstance.delete(`/admin/delete_promotion/${id}`);
    return response.data;
};
