import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { FetchGamesResponse, Game } from "../../Types/game";
import { API_ROUTES } from "../../Constants/api.routes";
import type { AxiosError } from "axios";
import api from "../../Lib/axios";

export interface GameState {
  loading: boolean;
  error: string | null;

  games: Game[];
  selectedGame: Game | null;
}

//Fetch all games
export const fetchGames = createAsyncThunk< FetchGamesResponse, void, { rejectValue: string } >(
  "admin/fetchGames",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.ADMIN.GAMES.GET_ALL );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{message:string}>;

      return rejectWithValue( err.response?.data?.message || "Failed fetching games" );
    }
  }
);

//Fetch A Game
export const getGameDetail = createAsyncThunk< Game, string, { rejectValue: string } >(
  "admin/getGameDetail",

  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.ADMIN.GAMES.BY_ID(id) );

      return response.data.data.game;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed getting game"
      );
    }
  }
);

//Change the status of the game
export const toggleGameStatus = createAsyncThunk< { gameId: string; isActive: boolean }, string, { rejectValue: string } >(
  "admin/toggleGameStatus",

  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch( API_ROUTES.ADMIN.GAMES.STATUS(id) );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed updating game status"
      );
    }
  }
);



const initialState: GameState = {
  loading: false,
  error: null,
  games: [],
  selectedGame: null,
};

const gameManagementSlice = createSlice({
  name: "gameManagement",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearSelectedGame: (state) => {
      state.selectedGame = null;
    },
  },

  extraReducers: (builder) => {
    builder

    // games

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

        //Game ddetails

    .addCase(getGameDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getGameDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGame = action.payload;
      })

      .addCase(getGameDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed getting game";
      })

    //Toggle the status
    .addCase(toggleGameStatus.fulfilled, (state, action) => {
        const game = state.games.find(
            g => g.id === action.payload.gameId
        );

        if (game) {
            game.isActive = action.payload.isActive;
        }

        if (
            state.selectedGame &&
            state.selectedGame.id === action.payload.gameId
        ) {
            state.selectedGame.isActive =
            action.payload.isActive;
        }
        })
  },
});

export const {
  clearError,
  clearSelectedGame,
} = gameManagementSlice.actions;

export default gameManagementSlice.reducer;