import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";

import type { FetchGamesResponse, Game } from "../../Types/game";
import type { Level } from "../../Types/level";
import type { LevelProgress, LevelProgressDetails, Progress, SubmitLevelPayload } from "../../Types/progress";
import type { CurrentChild } from "../../Types/child";

interface ChildGameState {
  loading: boolean;
  error: string | null;

  games: Game[];
  selectedGame: Game | null;

  levels: Level[];
  selectedLevel: Level | null;

  progress: LevelProgress[];
  selectedLevelProgress: LevelProgressDetails | null;

  sessionId: string | null;
  sessionActive: boolean;

  currentChild: CurrentChild | null;
}

interface CurrentChildSessionResponse {
  child: CurrentChild;
}

interface StartChildSessionResponse {
  sessionId: string;
  sessionToken: string;
}

export const startChildSession = createAsyncThunk<
  StartChildSessionResponse,
  string,
  { rejectValue: string }
>(
  "child/startSession",

  async (childId, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ROUTES.CHILD.SESSION.START, {
        childId,
      });

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed starting session",
      );
    }
  },
);

export const getCurrentChildSession = createAsyncThunk< CurrentChildSessionResponse, void, { rejectValue: string } >(
  "child/getCurrentSession",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.CHILD.SESSION.CURRENT );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed getting current session"
      );
    }
  }
);

export const getLevelProgress = createAsyncThunk<
  LevelProgressDetails,
  { gameId: string; levelId: string },
  { rejectValue: string }
>(
  "child/getLevelProgress",

  async ({ gameId, levelId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.CHILD.PROGRESS.BY_LEVEL(gameId, levelId)
      );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed fetching level progress"
      );
    }
  }
);

export const endChildSession = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  "child/endSession",

  async (_, { rejectWithValue }) => {
    try {
      await api.post(API_ROUTES.CHILD.SESSION.END);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed ending session",
      );
    }
  },
);

export const fetchGames = createAsyncThunk<
  FetchGamesResponse,
  void,
  { rejectValue: string }
>(
  "child/fetchGames",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.CHILD.GAMES.GET_ALL);

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed fetching games",
      );
    }
  },
);

export const getGameDetail = createAsyncThunk<
  Game,
  string,
  { rejectValue: string }
>(
  "child/getGameDetail",

  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.CHILD.GAMES.BY_ID(gameId));

      return response.data.data.game;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed getting game",
      );
    }
  },
);

export const fetchLevelsByGame = createAsyncThunk<
  Level[],
  string,
  { rejectValue: string }
>(
  "child/fetchLevelsByGame", 

  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.CHILD.GAMES.LEVELS(gameId));

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed fetching levels",
      );
    }
  },
);

export const getLevelDetail = createAsyncThunk<
  Level,
  { gameId: string; levelId: string },
  { rejectValue: string }
>(
  "child/getLevelDetail",

  async ({ gameId, levelId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.CHILD.GAMES.LEVEL_BY_ID(gameId, levelId),
      );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed fetching level",
      );
    }
  },
);

export const getGameProgress = createAsyncThunk<
  LevelProgress[],
  {
    childId: string;
    gameId: string;
  },
  { rejectValue: string }
>(
  "child/getGameProgress",

  async ({ childId, gameId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.CHILD.PROGRESS.BY_GAME(childId, gameId),
      );

      return response.data.data.levels;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed fetching progress",
      );
    }
  },
);

export const submitLevel = createAsyncThunk<
  Progress,
  SubmitLevelPayload,
  { rejectValue: string }
>(
  "child/submitLevel",

  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.CHILD.GAMES.SUBMIT_LEVEL(data.gameId, data.levelId),
        data,
      );
      
      return response.data.data.progress;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed submitting level",
      );
    }
  },
);

const initialState: ChildGameState = {
  loading: false,
  error: null,

  games: [],
  selectedGame: null,

  levels: [],
  selectedLevel: null,
  progress: [],
  selectedLevelProgress: null,

  sessionId: null,
  sessionActive: false,

  currentChild:  null
};

const childGameSlice = createSlice({
  name: "childGame",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearSelectedGame: (state) => {
      state.selectedGame = null;
    },

    clearSelectedLevel: (state) => {
      state.selectedLevel = null;
    },

    clearProgress: (state) => {
      state.progress = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(startChildSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(startChildSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionId;
        state.sessionActive = true;
      })

      .addCase(startChildSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed starting session";
      })

      .addCase(getCurrentChildSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCurrentChildSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChild = action.payload.child;
        state.sessionActive = true;
      })

      .addCase(getCurrentChildSession.rejected, (state, action) => {
        state.loading = false;
        state.sessionActive = false;
        state.error = action.payload || "Failed getting current session";
      })

      .addCase(getLevelProgress.fulfilled, (state, action) => {
        state.selectedLevelProgress = action.payload;
      })

      .addCase(getLevelProgress.rejected, (state, action) => {
        state.error = action.payload || "Failed fetching level progress";
      })

      .addCase(endChildSession.fulfilled, (state) => {
        state.sessionId = null;
        state.sessionActive = false;
      })

      .addCase(endChildSession.rejected, (state, action) => {
        state.error = action.payload || "Failed ending session";
      })

      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload.games;
      })

      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed fetching games";
      })

      .addCase(getGameDetail.fulfilled, (state, action) => {
        state.selectedGame = action.payload;
      })

      .addCase(fetchLevelsByGame.fulfilled, (state, action) => {
        state.levels = action.payload;
      })

      .addCase(getLevelDetail.fulfilled, (state, action) => {
        state.selectedLevel = action.payload;
      })

      .addCase(getGameProgress.pending, (state) => {
        state.loading = true;
      })

      .addCase(getGameProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })

      .addCase(getGameProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed fetching progress";
      })

      .addCase(submitLevel.fulfilled, (state, action) => {
        const index = state.progress.findIndex(
          (progress) => progress.levelId === action.payload.levelId,
        );

        if (index >= 0) {
          state.progress[index] = action.payload;
        } else {
          state.progress.push(action.payload);
        }
      });
  },
});

export const { clearError, clearSelectedGame, clearSelectedLevel, clearProgress } =
  childGameSlice.actions;

export default childGameSlice.reducer;
