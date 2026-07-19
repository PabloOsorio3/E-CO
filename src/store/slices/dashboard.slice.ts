import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getDashboardStats } from '../../api/admin/get/get_dashboard_stats';
import type { DashboardStatsResponse } from '../../interface/dashboard.interface';

interface DashboardState {
    stats: DashboardStatsResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    stats: null,
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
    },
});

export default dashboardSlice.reducer;
