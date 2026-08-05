import apiInstance from "../../instance/instance";
import type { PromotionResponse } from "../../../interface/promotion.interface";

export const getPromotions = async (): Promise<PromotionResponse[]> => {
    const response = await apiInstance.get('/get_promotions');
    return response.data;
};
