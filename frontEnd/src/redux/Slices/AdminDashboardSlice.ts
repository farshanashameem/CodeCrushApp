import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";
import type { DashboardStats } from "../../Types/admin";

interface AdminDashboardState {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
}

const initialState: AdminDashboardState = {
    stats: null,
    loading: false,
    error: null,
};


// ================= GET DASHBOARD STATS =================

export const getDashboardStats = createAsyncThunk<
    DashboardStats,
    void,
    { rejectValue: string }
>(
    "adminDashboard/getDashboardStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(API_ROUTES.ADMIN.DASHBOARDSTATS.STATS);
                

            if (!response.data.success) {
                return rejectWithValue(
                    "Failed to fetch dashboard statistics"
                );
            }

            return response.data.data;

        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to fetch dashboard statistics"
            );
        }
    }
);


// ================= SLICE =================

const adminDashboardSlice = createSlice({
    name: "adminDashboard",
    initialState,

    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // GET DASHBOARD STATS
            .addCase(getDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })

            .addCase(getDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    "Failed to fetch dashboard statistics";
            });
    },
});

export const {
    clearDashboardError,
} = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;