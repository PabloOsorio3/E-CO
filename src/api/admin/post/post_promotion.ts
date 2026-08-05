import apiInstance from "../../instance/instance";
import type { PromotionCreate } from "../../../interface/promotion.interface";

export const postPromotion = async (data: PromotionCreate) => {
    const response = await apiInstance.post('/admin/post_promotion', data);
    return response.data;
};
