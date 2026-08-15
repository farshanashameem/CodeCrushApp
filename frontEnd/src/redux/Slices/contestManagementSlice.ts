import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";

import type {
  Contest,
  ContestState,
  FetchContestsResponse,
  CreateContestPayload,
  UpdateContestPayload,
} from "../../Types/ContestManagement";

const initialState: ContestState = {
  loading: false,
  detailsLoading: false,
  error: null,
  contests: [],
  selectedContest: null,
};

// ==== Create Contest ==== //

export const createContest = createAsyncThunk<
  Contest,
  CreateContestPayload,
  { rejectValue: string }
>(
  "admin/createContest",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.ADMIN.CONTESTS.CREATE,
        payload
      );
      console.log("CREATE CONTEST RESPONSE:", response.data)

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed creating contest"
      );
    }
  }
);

// ==== Get All Contests ==== //

export const fetchContests = createAsyncThunk<
  FetchContestsResponse,
  void,
  { rejectValue: string }
>(
  "admin/fetchContests",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.CONTESTS.GET_ALL
      );
;
      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed fetching contests"
      );
    }
  }
);

// ==== Get Contest Details ==== //

export const getContestDetail = createAsyncThunk<
  { contest: Contest },
  { id: string },
  { rejectValue: string }
>(
  "admin/getContestDetail",

  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.CONTESTS.BY_ID(id)
      );

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return {
        contest: response.data.data,
      };
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed getting contest"
      );
    }
  }
);

// ==== Update Contest ==== //

export const updateContest = createAsyncThunk<
  Contest,
  UpdateContestPayload,
  { rejectValue: string }
>(
  "admin/updateContest",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.put(
        API_ROUTES.ADMIN.CONTESTS.UPDATE(payload.id),
        payload
      );

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed updating contest"
      );
    }
  }
);

const contestManagementSlice = createSlice({
  name: "contestManagement",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearSelectedContest: (state) => {
      state.selectedContest = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= CREATE CONTEST ================= */

      .addCase(createContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createContest.fulfilled, (state, action) => {
        state.loading = false;

        state.contests.push(action.payload);
      })

      .addCase(createContest.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed creating contest";
      })

      /* ================= FETCH CONTESTS ================= */

      .addCase(fetchContests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchContests.fulfilled, (state, action) => {
        state.loading = false;

        state.contests = action.payload;
      })

      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed fetching contests";
      })

      /* ================= GET CONTEST ================= */

      .addCase(getContestDetail.pending, (state) => {
        state.detailsLoading= true;
        state.error = null;
      })

      .addCase(getContestDetail.fulfilled, (state, action) => {
        state.detailsLoading = false;

        state.selectedContest = action.payload.contest;
      })

      .addCase(getContestDetail.rejected, (state, action) => {
        state.detailsLoading = false;

        state.error =
          action.payload || "Failed getting contest";
      })

      /* ================= UPDATE CONTEST ================= */

      .addCase(updateContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateContest.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.contests.findIndex(
          (contest) => contest.id === action.payload.id
        );

        if (index !== -1) {
          state.contests[index] = action.payload;
        }

        if (
          state.selectedContest &&
          state.selectedContest.id === action.payload.id
        ) {
          state.selectedContest = action.payload;
        }
      })

      .addCase(updateContest.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed updating contest";
      });
  },
});

export const {
  clearError,
  clearSelectedContest,
} = contestManagementSlice.actions;

export default contestManagementSlice.reducer;