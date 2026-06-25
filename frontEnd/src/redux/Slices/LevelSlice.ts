import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CreateLevelPayload, Level, UpdateLevelPayload } from "../../Types/level";
import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";
import type { AxiosError } from "axios";
import type { CreatePicturePuzzleLevelPayload } from "../../Types/picturePuzzle";

export const fetchLevelsByGame = createAsyncThunk< Level[],  string, { rejectValue: string } >(
  "admin/fetchLevelsByGame",

  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.ADMIN.LEVELS.BY_GAME(gameId) );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed fetching levels"
      );
    }
  }
);

export const getLevelDetail = createAsyncThunk< Level, string, { rejectValue: string } >(
  "admin/getLevelDetail",

  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.ADMIN.LEVELS.BY_ID(id) );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed fetching level"
      );
    }
  }
);

export const toggleLevelStatus = createAsyncThunk< string,  string, { rejectValue: string } >(
  "admin/toggleLevelStatus",

  async (id, { rejectWithValue }) => {
    try {
      await api.patch( API_ROUTES.ADMIN.LEVELS.STATUS(id) );

      return id;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed updating level status"
      );
    }
  }
);


export const createLevel = createAsyncThunk< { success: boolean; message: string }, CreateLevelPayload, { rejectValue: string } >(
  "admin/createLevel",

  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.ADMIN.LEVELS.CREATE,
        data
      );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed creating level"
      );
    }
  }
);

export const updateLevel = createAsyncThunk<
  { success: boolean; message: string },
  {
    levelId: string;
    data: UpdateLevelPayload;
  }, { rejectValue: string } >(
  "admin/updateLevel",

  async ({ levelId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put( API_ROUTES.ADMIN.LEVELS.UPDATE(levelId), data );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed updating level"
      );
    }
  }
);

interface LevelState {
  levels: Level[];
  selectedLevel: Level | null;
  loading: boolean;
  error: string | null;
}

const initialState: LevelState = {
  levels: [],
  selectedLevel: null,
  loading: false,
  error: null,
};

const levelSlice = createSlice({
  name: "levelManagement",
  initialState,
  reducers: {
    clearSelectedLevel: (state) => {
      state.selectedLevel = null;
    },

    clearLevelError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {

  builder

    // =========================
    // FETCH LEVELS BY GAME
    // =========================

    .addCase(fetchLevelsByGame.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(fetchLevelsByGame.fulfilled, (state, action) => {
      state.loading = false;
      state.levels = action.payload;
    })

    .addCase(fetchLevelsByGame.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed fetching levels";
    })

    // =========================
    // GET LEVEL DETAIL
    // =========================

    .addCase(getLevelDetail.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(getLevelDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedLevel = action.payload;
    })

    .addCase(getLevelDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed fetching level";
    })

    // =========================
    // CREATE LEVEL
    // =========================

    .addCase(createLevel.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(createLevel.fulfilled, (state) => {
      state.loading = false;
    })

    .addCase(createLevel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed creating level";
    })

    // =========================
    // UPDATE LEVEL
    // =========================

    .addCase(updateLevel.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(updateLevel.fulfilled, (state) => {
      state.loading = false;
    
    })

    .addCase(updateLevel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed updating level";
    })

    // =========================
    // TOGGLE LEVEL STATUS
    // =========================

    .addCase(toggleLevelStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(toggleLevelStatus.fulfilled, (state, action) => {
      state.loading = false;

      const level = state.levels.find(
        (level) => level.id === action.payload
      );

      if (level) {
        level.isActive = !level.isActive;
      }

      if (
        state.selectedLevel &&
        state.selectedLevel.id === action.payload
      ) {
        state.selectedLevel.isActive =
          !state.selectedLevel.isActive;
      }
    })

    .addCase(toggleLevelStatus.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload || "Failed updating level status";
    });
}
});

export const {
  clearSelectedLevel,
  clearLevelError,
} = levelSlice.actions;

export default levelSlice.reducer;