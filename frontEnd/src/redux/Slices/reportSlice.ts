import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";
import type { ChildProgressReportData, GamePerformanceReportData, LevelPerformanceReport, ReportState, RevenueReportData, UserReportData, AIGamePopularityReportData } from "../../Types/reports";
import { downloadExcel } from "../../Utils/downloadExcel";



const initialState: ReportState = {
  userReport: null,
  childReport: null,
  gameReport: null,
  levelReport: null,
  revenueReport: null,
  aiGamePopularityReport: null,
  loading: false,
  exportLoading: false,
  error: null,
};

export const fetchUserReport = createAsyncThunk<
  UserReportData,
  {
    range: "today" | "week" | "month" | "year" | "custom";
    from?: string;
    to?: string;
  },
  { rejectValue: string }
>(
  "report/fetchUserReport",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.REPORTS.USER,
        {
          params,
        }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Failed to fetch user report."
      );
    }
  }
);

export const fetchChildReport = createAsyncThunk<
  ChildProgressReportData,
  {
    range: "today" | "week" | "month" | "year" | "custom";
    from?: string;
    to?: string;
  },
  { rejectValue: string }
>(
  "report/fetchChildReport",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.REPORTS.CHILDREN,
        {
          params,
        }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ??
          "Failed to fetch child report."
      );
    }
  }
);


export const fetchGameReport = createAsyncThunk<
  GamePerformanceReportData,
  {
    range: "today" | "week" | "month" | "year" | "custom";
    from?: string;
    to?: string;
  },
  { rejectValue: string }
>(
  "report/fetchGameReport",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.REPORTS.GAMES,
        {
          params,
        }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ??
          "Failed to fetch game report."
      );
    }
  }
);

export const fetchLevelReport = createAsyncThunk<
  LevelPerformanceReport,
  {
    range: "today" | "week" | "month" | "year" | "custom";
    from?: string;
    to?: string;
    gameId?: string;
  },
  { rejectValue: string }
>(
  "report/fetchLevelReport",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.REPORTS.LEVELS,
        {
          params,
        }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ??
          "Failed to fetch level report."
      );
    }
  }
);

export const fetchRevenueReport = createAsyncThunk<
  RevenueReportData,
  {
    range: "today" | "week" | "month" | "year" | "custom";
    from?: string;
    to?: string;
  },
  { rejectValue: string }
>(
  "report/fetchRevenueReport",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.REPORTS.REVENUE,
        {
          params,
        }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ??
          "Failed to fetch revenue report."
      );
    }
  }
);


export const exportUserReport = createAsyncThunk<
    void,
    {
        range: "today" | "week" | "month" | "year" | "custom";
        from?: string;
        to?: string;
    },
    { rejectValue: string }
>(
    "report/exportUserReport",
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get(
                API_ROUTES.ADMIN.EXPORT_REPORTS.USER_REPORT,
                {
                    params,
                    responseType: "blob",
                }
            );
            downloadExcel(response.data, "User-report.xlsx");

        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ??
                "Failed to export user report."
            );
        }
    }
);

export const exportChildReport = createAsyncThunk<
    void,
    {
        range: "today" | "week" | "month" | "year" | "custom";
        from?: string;
        to?: string;
    },
    { rejectValue: string }
>(
    "report/exportChildReport",
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get(
                API_ROUTES.ADMIN.EXPORT_REPORTS.CHILD_REPORT,
                {
                    params,
                    responseType: "blob",
                }
            );

            downloadExcel(response.data, "Child-report.xlsx");

        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ??
                "Failed to export the report."
            );
        }
    }
);

export const exportGameReport = createAsyncThunk<
    void,
    {
        range: "today" | "week" | "month" | "year" | "custom";
        from?: string;
        to?: string;
    },
    { rejectValue: string }
>(
    "report/exportGameReport",
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get(
                API_ROUTES.ADMIN.EXPORT_REPORTS.GAME_REPORT,
                {
                    params,
                    responseType: "blob",
                }
            );

            downloadExcel(response.data, "Game-report.xlsx");

        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ??
                "Failed to export the report."
            );
        }
    }
);

export const exportLevelReport = createAsyncThunk<
    void,
    {
        range: "today" | "week" | "month" | "year" | "custom";
        from?: string;
        to?: string;
    },
    { rejectValue: string }
>(
    "report/exportLevelReport",
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get(
                API_ROUTES.ADMIN.EXPORT_REPORTS.LEVEL_REPORT,
                {
                    params,
                    responseType: "blob",
                }
            );

            downloadExcel(response.data, "Level-report.xlsx");

        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ??
                "Failed to export the report."
            );
        }
    }
);

export const exportRevenueReport = createAsyncThunk<
    void,
    {
        range: "today" | "week" | "month" | "year" | "custom";
        from?: string;
        to?: string;
    },
    { rejectValue: string }
>(
    "report/exportRevenueReport",
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get(
                API_ROUTES.ADMIN.EXPORT_REPORTS.REVENUE_REPORT,
                {
                    params,
                    responseType: "blob",
                }
            );

            downloadExcel(response.data, "Revenue-report.xlsx");

        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ??
                "Failed to export the report."
            );
        }
    }
);

export const fetchAIGamePopularityReport = createAsyncThunk<
  AIGamePopularityReportData[],
  void,
  { rejectValue: string }
>(
  "report/fetchAIGamePopularityReport",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.ADMIN.REPORTS.AI_GAME_POPULARITY );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ??
          "Failed to fetch AI game popularity report."
      );
    }
  }
);

export const exportAIGamePopularityReport = createAsyncThunk< void, void, { rejectValue: string } >( "report/exportAIGamePopularityReport", async (_, { rejectWithValue }) => 
  { 
    try 
    { const response = await api.get( API_ROUTES.ADMIN.EXPORT_REPORTS.AI_GAME_POPULARITY_REPORT, { responseType: "blob", } ); downloadExcel( response.data, "AI-game-popularity-report.xlsx" ); } catch (error: any) { return rejectWithValue( error.response?.data?.message ?? "Failed to export AI game popularity report." ); 
      
    } } );


const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    clearReportError(state) {
      state.error = null;
    },

    clearUserReport(state) {
      state.userReport = null;
    },
    clearChildReport(state) {
      state.childReport = null;
    },
    clearGameReport(state) {
      state.gameReport = null;
    },
    clearLevelReport(state) {
      state.levelReport = null;
    },

    clearRevenueReport( state) {
      state.revenueReport = null;
    },
    clearAIGamePopularityReport(state) {
      state.aiGamePopularityReport = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserReport.fulfilled, (state, action) => {
        state.loading = false;
        state.userReport = action.payload;
      })

      .addCase(fetchUserReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong.";
      })

      .addCase(fetchChildReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchChildReport.fulfilled, (state, action) => {
        state.loading = false;
        state.childReport = action.payload;
      })

      .addCase(fetchChildReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong.";
      })

      .addCase(fetchGameReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchGameReport.fulfilled, (state, action) => {
        state.loading = false;
        state.gameReport = action.payload;
      })

      .addCase(fetchGameReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong.";
      })

      .addCase(fetchLevelReport.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLevelReport.fulfilled, (state, action) => {
        state.loading = false;
        state.levelReport = action.payload;
      })

      .addCase(fetchLevelReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong.";
      })

      .addCase(fetchRevenueReport.pending, (state) => {
          state.loading = true;
          state.error = null;
      })

      .addCase(fetchRevenueReport.fulfilled, (state, action) => {
          state.loading = false;
          state.revenueReport = action.payload;
      })

      .addCase(fetchRevenueReport.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload ?? "Failed to fetch revenue report.";
      })

      .addCase(exportUserReport.pending, (state) => {
          state.exportLoading = true;
      })

      .addCase(exportUserReport.fulfilled, (state) => {
          state.exportLoading = false;
      })

      .addCase(exportUserReport.rejected, (state, action) => {
          state.exportLoading = false;
          state.error = action.payload ?? "Failed to export report.";
      })

      .addCase(exportChildReport.pending, (state) => {
          state.exportLoading = true;
      })

      .addCase(exportChildReport.fulfilled, (state) => {
          state.exportLoading = false;
      })

      .addCase(exportChildReport.rejected, (state, action) => {
          state.exportLoading = false;
          state.error = action.payload ?? "Failed to export report.";
      })

      .addCase(exportGameReport.pending, (state) => {
          state.exportLoading = true;
      })

      .addCase(exportGameReport.fulfilled, (state) => {
          state.exportLoading = false;
      })

      .addCase(exportGameReport.rejected, (state, action) => {
          state.exportLoading = false;
          state.error = action.payload ?? "Failed to export report.";
      })

      .addCase(exportLevelReport.pending, (state) => {
          state.exportLoading = true;
      })

      .addCase(exportLevelReport.fulfilled, (state) => {
          state.exportLoading = false;
      })

      .addCase(exportLevelReport.rejected, (state, action) => {
          state.exportLoading = false;
          state.error = action.payload ?? "Failed to export report.";
      })

      .addCase(exportRevenueReport.pending, (state) => {
          state.exportLoading = true;
      })

      .addCase(exportRevenueReport.fulfilled, (state) => {
          state.exportLoading = false;
      })

      .addCase(exportRevenueReport.rejected, (state, action) => {
          state.exportLoading = false;
          state.error = action.payload ?? "Failed to export report.";
      })

      .addCase(fetchAIGamePopularityReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAIGamePopularityReport.fulfilled, (state, action) => {
        state.loading = false;
        state.aiGamePopularityReport = action.payload;
      })

      .addCase(fetchAIGamePopularityReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch AI game popularity report.";
      })

      
      .addCase(exportAIGamePopularityReport.pending, (state) => {
        state.exportLoading = true;
        state.error = null;
      })

      .addCase(exportAIGamePopularityReport.fulfilled, (state) => {
        state.exportLoading = false;
      })

      .addCase(exportAIGamePopularityReport.rejected, (state, action) => {
        state.exportLoading = false;
        state.error =
          action.payload ?? "Failed to export AI game popularity report.";
      })


  },
      });

export const {
  clearReportError,
  clearUserReport,
  clearChildReport,
  clearGameReport,
  clearLevelReport,
} = reportSlice.actions;

export default reportSlice.reducer;