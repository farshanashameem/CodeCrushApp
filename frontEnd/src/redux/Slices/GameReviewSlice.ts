import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";

import type {
  GameReview,
  GameReviewState,
  CreateGameReviewPayload,
  GetGameReviewPayload,
  GetGameReviewsResponse,
} from "../../Types/GameReview";


const initialState: GameReviewState = {
  loading: false,
  error: null,
  selectedReview: null,
  reviews: [],
  averageRating: 0,
  totalReviews: 0,
};


// ==========================================================
// CREATE / UPDATE GAME REVIEW
// ==========================================================

export const createGameReview = createAsyncThunk<
  GameReview,
  CreateGameReviewPayload,
  { rejectValue: string }
>(
  "gameReview/createGameReview",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.CHILD.REVIEW.BY_GAME(payload.gameId),
        {
          childId: payload.childId,
          gameId: payload.gameId,
          rating: payload.rating,
          review: payload.review,
        }
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
          "Failed creating game review"
      );
    }
  }
);


// ==========================================================
// GET CHILD'S REVIEW FOR A GAME
// ==========================================================

export const getGameReview = createAsyncThunk<
  GameReview,
  GetGameReviewPayload,
  { rejectValue: string }
>(
  "gameReview/getGameReview",
  
  async ({ childId, gameId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.CHILD.REVIEW.BY_GAME(gameId),
        {
          params: {
            childId,
          },
        }
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
          "Failed getting game review"
      );
    }
  }
);


// ==========================================================
// GET ALL REVIEWS FOR A GAME
// ==========================================================

export const getGameReviews = createAsyncThunk<
  GetGameReviewsResponse,
  string,
  { rejectValue: string }
>(
  "gameReview/getGameReviews",

  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ROUTES.CHILD.REVIEW.ALL_BY_GAME(gameId)
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
          "Failed getting game reviews"
      );
    }
  }
);


// ==========================================================
// SLICE
// ==========================================================

const gameReviewSlice = createSlice({

  name: "gameReview",

  initialState,

  reducers: {

    clearError: (state) => {
      state.error = null;
    },

    clearSelectedReview: (state) => {
      state.selectedReview = null;
    },

    clearGameReviews: (state) => {
      state.reviews = [];
      state.averageRating = 0;
      state.totalReviews = 0;
    },

  },

  extraReducers: (builder) => {

    builder

      // ======================================================
      // CREATE / UPDATE REVIEW
      // ======================================================

      .addCase(createGameReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createGameReview.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReview = action.payload;
      })

      .addCase(createGameReview.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed creating game review";
      })


      // ======================================================
      // GET CHILD REVIEW
      // ======================================================

      .addCase(getGameReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getGameReview.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReview = action.payload;
      })

      .addCase(getGameReview.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed getting game review";
      })


      // ======================================================
      // GET ALL GAME REVIEWS
      // ======================================================

      .addCase(getGameReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getGameReviews.fulfilled, (state, action) => {
        state.loading = false;

        state.reviews = action.payload.reviews;
        state.averageRating = action.payload.averageRating;
        state.totalReviews = action.payload.totalReviews;
      })

      .addCase(getGameReviews.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed getting game reviews";
      });

  },
});


export const {
  clearError,
  clearSelectedReview,
  clearGameReviews,
} = gameReviewSlice.actions;


export default gameReviewSlice.reducer;