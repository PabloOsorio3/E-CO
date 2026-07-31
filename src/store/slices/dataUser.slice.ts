import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getDataUser } from '../../api/admin/get/get_data_user';
import { putDataUser } from '../../api/admin/put/put_data_user';
import type { DataUserResponse, DataUserUpdate } from '../../interface/dataUser.interface';

interface DataUserState {
    data: DataUserResponse | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
}

const initialState: DataUserState = {
    data: null,
    loading: false,
    saving: false,
    error: null,
};

export const fetchMyDataThunk = createAsyncThunk(
    'dataUser/fetchMine',
    async (_, { rejectWithValue }) => {
        try {
            return await getDataUser();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al cargar los datos del perfil');
        }
    }
);

export const updateMyDataThunk = createAsyncThunk(
    'dataUser/updateMine',
    async (data: DataUserUpdate, { rejectWithValue }) => {
        try {
            return await putDataUser(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Error al guardar los datos del perfil');
        }
    }
);

const dataUserSlice = createSlice({
    name: 'dataUser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyDataThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyDataThunk.fulfilled, (state, action: PayloadAction<DataUserResponse | null>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchMyDataThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(updateMyDataThunk.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(updateMyDataThunk.fulfilled, (state, action: PayloadAction<DataUserResponse>) => {
                state.saving = false;
                state.data = action.payload;
            })
            .addCase(updateMyDataThunk.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload as string;
            });
    },
});

export default dataUserSlice.reducer;
