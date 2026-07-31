import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getDashboardStats } from '../../api/admin/get/get_dashboard_stats';
import { getSalesReport } from '../../api/admin/get/get_sales_report';
import { getBestSellingProducts } from '../../api/admin/get/get_best_selling_products';
import type { BestSellingProductItem, DashboardStatsResponse, SalesReportItem } from '../../interface/dashboard.interface';

interface DashboardState {
    stats: DashboardStatsResponse | null;
    salesReport: SalesReportItem[];
    bestSellingProducts: BestSellingProductItem[];
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    stats: null,
    salesReport: [],
    bestSellingProducts: [],
    loading: false,
    error: null,
};

export const fetchDashboardStatsThunk = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            return await getDashboardStats();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar las métricas del dashboard');
        }
    }
);

export const fetchSalesReportThunk = createAsyncThunk(
    'dashboard/fetchSalesReport',
    async (days: number | undefined, { rejectWithValue }) => {
        try {
            return await getSalesReport(days);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar el reporte de ventas');
        }
    }
);

export const fetchBestSellingProductsThunk = createAsyncThunk(
    'dashboard/fetchBestSellingProducts',
    async (limit: number | undefined, { rejectWithValue }) => {
        try {
            return await getBestSellingProducts(limit);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar los productos más vendidos');
        }
    }
);

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStatsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStatsThunk.fulfilled, (state, action: PayloadAction<DashboardStatsResponse>) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStatsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchSalesReportThunk.fulfilled, (state, action: PayloadAction<SalesReportItem[]>) => {
                state.salesReport = action.payload;
            })
            .addCase(fetchSalesReportThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchBestSellingProductsThunk.fulfilled, (state, action: PayloadAction<BestSellingProductItem[]>) => {
                state.bestSellingProducts = action.payload;
            })
            .addCase(fetchBestSellingProductsThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default dashboardSlice.reducer;
