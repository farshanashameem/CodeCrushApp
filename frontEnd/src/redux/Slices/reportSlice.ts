import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";

import type {
  ChildProgressReportData,
  GamePerformanceReportData,
  LevelPerformanceReport,
  ReportState,
  RevenueReportData,
  UserReportData,
  AIGamePopularityReportData,
} from "../../Types/reports";

import { downloadExcel } from "../../Utils/downloadExcel";

/* ===================================================================== */
/* HELPERS */
/* ===================================================================== */

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return fallbackMessage;
};

/* ===================================================================== */
/* INITIAL STATE */
/* ===================================================================== */

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

/* ===================================================================== */
/* FETCH USER REPORT */
/* ===================================================================== */

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
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch user report.",
        ),
      );
    }
  },
);

/* ===================================================================== */
/* FETCH CHILD REPORT */
/* ===================================================================== */

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
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch child report.",
        ),
      );
    }
  },
);

/* ===================================================================== */
/* FETCH GAME REPORT */
/* ===================================================================== */

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
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch game report.",
        ),
      );
    }
  },
);

/* ===================================================================== */
/* FETCH LEVEL REPORT */
/* ===================================================================== */

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
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch level report.",
        ),
      );
    }
  },
);

/* ===================================================================== */
/* FETCH REVENUE REPORT */
/* ===================================================================== */

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
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch revenue report.",
        ),
      );
    }
  },
);

/* ===================================================================== */
/* EXPORT USER REPORT */
/* ===================================================================== */

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
        },
      );

      downloadExcel(
        response.data,
        "User-report.xlsx",
      );
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to export user report.",
        ),
      );
    }
  },
);

/* ===================================================================== */
/* EXPORT CHILD REPORT */
/* ===================================================================== */

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
        },
      );

      downloadExcel(
        response.data,
        "Child-report.xlsx",
      );
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to export the report.",
        ),
      );
    }
  },
);

/* ===================================================================== */
/* EXPORT GAME REPORT */
/* ===================================================================== */

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
        },
      );

      downloadExcel(
        response.data,
        "Game-report.xlsx",
      );
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to export the report.",
        ),
      );
    }
  },
);

/* ===================================================================== */
/* EXPORT LEVEL REPORT */
/* ===================================================================== */

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
        },
      );

      downloadExcel(
        response.data,
        "Level-report.xlsx",
      );
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to export the report.",
        ),
      );
    }
  },
);

/* ===================================================================== */
/* EXPORT REVENUE REPORT */
/* ===================================================================== */

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
        },
      );

      downloadExcel(
        response.data,
        "Revenue-report.xlsx",
      );
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to export the report.",
        ),
      );
    }
  },
);

/* ===================================================================== */
/* FETCH AI GAME POPULARITY REPORT */
/* ===================================================================== */

export const fetchAIGamePopularityReport =
  createAsyncThunk<
    AIGamePopularityReportData[],
    void,
    { rejectValue: string }
  >(
    "report/fetchAIGamePopularityReport",
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get(
          API_ROUTES.ADMIN.REPORTS.AI_GAME_POPULARITY,
        );

        return response.data.data;
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch AI game popularity report.",
          ),
        );
      }
    },
  );

/* ===================================================================== */
/* EXPORT AI GAME POPULARITY REPORT */
/* ===================================================================== */

export const exportAIGamePopularityReport =
  createAsyncThunk<
    void,
    void,
    { rejectValue: string }
  >(
    "report/exportAIGamePopularityReport",
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get(
          API_ROUTES.ADMIN.EXPORT_REPORTS
            .AI_GAME_POPULARITY_REPORT,
          {
            responseType: "blob",
          },
        );

        downloadExcel(
          response.data,
          "AI-game-popularity-report.xlsx",
        );
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to export AI game popularity report.",
          ),
        );
      }
    },
  );

/* ===================================================================== */
/* SLICE */
/* ===================================================================== */

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

    clearRevenueReport(state) {
      state.revenueReport = null;
    },

    clearAIGamePopularityReport(state) {
      state.aiGamePopularityReport = null;
    },
  },

  extraReducers: (builder) => {
    /* =============================================================== */
    /* USER REPORT */
    /* =============================================================== */

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
        state.error =
          action.payload ?? "Something went wrong.";
      });

    /* =============================================================== */
    /* CHILD REPORT */
    /* =============================================================== */

    builder
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
        state.error =
          action.payload ?? "Something went wrong.";
      });

    /* =============================================================== */
    /* GAME REPORT */
    /* =============================================================== */

    builder
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
        state.error =
          action.payload ?? "Something went wrong.";
      });

    /* =============================================================== */
    /* LEVEL REPORT */
    /* =============================================================== */

    builder
      .addCase(fetchLevelReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLevelReport.fulfilled, (state, action) => {
        state.loading = false;
        state.levelReport = action.payload;
      })

      .addCase(fetchLevelReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Something went wrong.";
      });

    /* =============================================================== */
    /* REVENUE REPORT */
    /* =============================================================== */

    builder
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
        state.error =
          action.payload ??
          "Failed to fetch revenue report.";
      });

    /* =============================================================== */
    /* EXPORT USER */
    /* =============================================================== */

    builder
      .addCase(exportUserReport.pending, (state) => {
        state.exportLoading = true;
      })

      .addCase(exportUserReport.fulfilled, (state) => {
        state.exportLoading = false;
      })

      .addCase(exportUserReport.rejected, (state, action) => {
        state.exportLoading = false;
        state.error =
          action.payload ?? "Failed to export report.";
      });

    /* =============================================================== */
    /* EXPORT CHILD */
    /* =============================================================== */

    builder
      .addCase(exportChildReport.pending, (state) => {
        state.exportLoading = true;
      })

      .addCase(exportChildReport.fulfilled, (state) => {
        state.exportLoading = false;
      })

      .addCase(exportChildReport.rejected, (state, action) => {
        state.exportLoading = false;
        state.error =
          action.payload ?? "Failed to export report.";
      });

    /* =============================================================== */
    /* EXPORT GAME */
    /* =============================================================== */

    builder
      .addCase(exportGameReport.pending, (state) => {
        state.exportLoading = true;
      })

      .addCase(exportGameReport.fulfilled, (state) => {
        state.exportLoading = false;
      })

      .addCase(exportGameReport.rejected, (state, action) => {
        state.exportLoading = false;
        state.error =
          action.payload ?? "Failed to export report.";
      });

    /* =============================================================== */
    /* EXPORT LEVEL */
    /* =============================================================== */

    builder
      .addCase(exportLevelReport.pending, (state) => {
        state.exportLoading = true;
      })

      .addCase(exportLevelReport.fulfilled, (state) => {
        state.exportLoading = false;
      })

      .addCase(exportLevelReport.rejected, (state, action) => {
        state.exportLoading = false;
        state.error =
          action.payload ?? "Failed to export report.";
      });

    /* =============================================================== */
    /* EXPORT REVENUE */
    /* =============================================================== */

    builder
      .addCase(exportRevenueReport.pending, (state) => {
        state.exportLoading = true;
      })

      .addCase(exportRevenueReport.fulfilled, (state) => {
        state.exportLoading = false;
      })

      .addCase(exportRevenueReport.rejected, (state, action) => {
        state.exportLoading = false;
        state.error =
          action.payload ?? "Failed to export report.";
      });

    /* =============================================================== */
    /* AI GAME POPULARITY */
    /* =============================================================== */

    builder
      .addCase(
        fetchAIGamePopularityReport.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchAIGamePopularityReport.fulfilled,
        (state, action) => {
          state.loading = false;
          state.aiGamePopularityReport =
            action.payload;
        },
      )

      .addCase(
        fetchAIGamePopularityReport.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to fetch AI game popularity report.";
        },
      );

    /* =============================================================== */
    /* EXPORT AI GAME POPULARITY */
    /* =============================================================== */

    builder
      .addCase(
        exportAIGamePopularityReport.pending,
        (state) => {
          state.exportLoading = true;
          state.error = null;
        },
      )

      .addCase(
        exportAIGamePopularityReport.fulfilled,
        (state) => {
          state.exportLoading = false;
        },
      )

      .addCase(
        exportAIGamePopularityReport.rejected,
        (state, action) => {
          state.exportLoading = false;
          state.error =
            action.payload ??
            "Failed to export AI game popularity report.";
        },
      );
  },
});

/* ===================================================================== */
/* ACTIONS */
/* ===================================================================== */

export const {
  clearReportError,
  clearUserReport,
  clearChildReport,
  clearGameReport,
  clearLevelReport,
  clearRevenueReport,
  clearAIGamePopularityReport,
} = reportSlice.actions;

/* ===================================================================== */
/* REDUCER */
/* ===================================================================== */

export default reportSlice.reducer;