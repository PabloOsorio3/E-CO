import apiInstance from "../../instance/instance";
import type { SalesReportItem } from "../../../interface/dashboard.interface";

export const getSalesReport = async (days: number = 7): Promise<SalesReportItem[]> => {
    try {
        const response = await apiInstance.get('/admin/get_sales_report', { params: { days } });
        return response.data;
    } catch (error) {
        console.error('Error fetching sales report:', error);
        throw error;
    }
};
