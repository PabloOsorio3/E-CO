export interface DashboardStatsResponse {
    total_sales: number;
    total_sales_trend: number;
    new_orders: number;
    new_orders_trend: number;
    products_count: number;
    customers_count: number;
}

export interface SalesReportItem {
    date: string;
    total: number;
}

export interface BestSellingProductItem {
    id_product: number;
    name: string;
    quantity_sold: number;
    revenue: number;
}
