import apiInstance from "../../instance/instance";
import type { PromotionUpdate } from "../../../interface/promotion.interface";

export const putPromotion = async (id: number, data: PromotionUpdate) => {
    const response = await apiInstance.put(`/admin/put_promotion/${id}`, data);
    return response.data;
};
