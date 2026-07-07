import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Icon } from "../../Types/icon";
import { API_ROUTES } from "../../Constants/api.routes";
import api from "../../Lib/axios";
import type { AxiosError } from "axios";

/* =========================
   THUNKS
========================= */
 
export const fetchIcons = createAsyncThunk<
  Icon[],
  void,
  { rejectValue: string }
>(
  "admin/fetchIcons",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.ADMIN.ICONS.GET_ALL
      );

      return response.data.data.icons;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed fetching icons"
      );
    }
  }
);

export const createIcon = createAsyncThunk<
  Icon,
  Partial<Icon>,
  { rejectValue: string }
>(
  "admin/createIcon",

  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.ADMIN.ICONS.CREATE,
        data
      );

      return response.data.data.icon;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed creating icon"
      );
    }
  }
);

export const deleteIcon = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "admin/deleteIcon",

  async (iconId, { rejectWithValue }) => {
    try {
      await api.delete(
        API_ROUTES.ADMIN.ICONS.DELETE(iconId)
      );

      return iconId;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed deleting icon"
      );
    }
  }
);

/* =========================
   STATE
========================= */

interface IconState {
  icons: Icon[];
  loading: boolean;
  error: string | null;
}

const initialState: IconState = {
  icons: [],
  loading: false,
  error: null,
};

/* =========================
   SLICE
========================= */

const iconSlice = createSlice({
  name: "iconManagement",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* Fetch Icons */
      .addCase(fetchIcons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchIcons.fulfilled, (state, action) => {
        state.loading = false;
        state.icons = action.payload;
      })

      .addCase(fetchIcons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* Create Icon */
      .addCase(createIcon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createIcon.fulfilled, (state, action) => {
        state.loading = false;
        state.icons.push(action.payload);
      })

      .addCase(createIcon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* Delete Icon */
      .addCase(deleteIcon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteIcon.fulfilled, (state, action) => {
        state.loading = false;

        state.icons = state.icons.filter(
          (icon) => icon.id !== action.payload
        );
      })

      .addCase(deleteIcon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export default iconSlice.reducer;