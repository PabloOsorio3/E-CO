import apiInstance from "../../instance/instance";
import type { DashboardStatsResponse } from "../../../interface/dashboard.interface";

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
    try {
        const response = await apiInstance.get('/admin/get_dashboard_stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};
