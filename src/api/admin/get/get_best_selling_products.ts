import apiInstance from "../../instance/instance";
import type { BestSellingProductItem } from "../../../interface/dashboard.interface";

export const getBestSellingProducts = async (limit: number = 5): Promise<BestSellingProductItem[]> => {
    try {
        const response = await apiInstance.get('/admin/get_best_selling_products', { params: { limit } });
        return response.data;
    } catch (error) {
        console.error('Error fetching best selling products:', error);
        throw error;
    }
};
