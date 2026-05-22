import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";

import type {
  User,
  UserState,
  FetchUsersParams,
  FetchUsersResponse,
  ToggleUserStatusArgs,
  ToggleUserStatusPayload,
} from "../../Types/UserManagement";

const initialState: UserState = {
  loading: false,

  error: null,

  users: [],

  selectedUser: null,

  pagination: {
    totalPages: 0,
    totalCount: 0,
  },
};

/* ================= FETCH USERS ================= */

export const fetchUsers = createAsyncThunk<
  FetchUsersResponse,
  FetchUsersParams | undefined,
  { rejectValue: string }
>(
  "admin/fetchUsers",

  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.ADMIN.USERS.GET_ALL, {
        params,
      });

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed fetching users",
      );
    }
  },
);

/* ================= GET USER DETAILS ================= */

export const getUserDetail = createAsyncThunk<
  { user: User },
  { id: string },
  { rejectValue: string }
>(
  "admin/getUserDetail",

  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.ADMIN.USERS.BY_ID(id));

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return {
        user: response.data.data,
      };
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed getting user",
      );
    }
  },
);

/* ================= TOGGLE USER STATUS ================= */

export const toggleUserStatus = createAsyncThunk<
  ToggleUserStatusPayload,
  ToggleUserStatusArgs,
  { rejectValue: string }
>(
  "admin/toggleUserStatus",

  async ({ id, action }, { rejectWithValue }) => {
    try {
      const response = await api.patch(API_ROUTES.ADMIN.USERS.STATUS(id), {
        action,
      });

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return {
        id: response.data.data.id,

        status: response.data.data.status,
      };
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed updating status",
      );
    }
  },
);

/* ================= SLICE ================= */

const userManagementSlice = createSlice({
  name: "userManagement",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH USERS */

      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        state.users = action.payload.users;

        state.pagination.totalPages = action.payload.totalPages;

        state.pagination.totalCount = action.payload.totalCount;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed fetching users";
      })

      /* GET USER */

      .addCase(getUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.loading = false;

        state.selectedUser = action.payload.user;
      })

      .addCase(getUserDetail.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed getting user";
      })

      /* TOGGLE STATUS */

      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;

        const { id, status } = action.payload;

        const user = state.users.find((u) => u.id === id);

        if (user) {
          user.status = status as User["status"];
        }

        if (state.selectedUser && state.selectedUser.id === id) {
          state.selectedUser.status = status as User["status"];
        }
      })

      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed updating status";
      });
  },
});

export const { clearError, clearSelectedUser } = userManagementSlice.actions;

export default userManagementSlice.reducer;
