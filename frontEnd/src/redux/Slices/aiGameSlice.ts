import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";

import type {
    AIGameConfig,
    CreateAIGamePayload,
} from "../../Types/aiGame";

/* =========================================================
   State
========================================================= */

interface AIGameState {
    game: AIGameConfig | null;
    loading: boolean;
    error: string | null;
}

/* =========================================================
   API Error
========================================================= */

interface ApiErrorResponse {
    message?: string;
}

/* =========================================================
   Error Helper
========================================================= */

const getErrorMessage = (
    error: unknown,
    fallbackMessage: string
): string => {
    if (error instanceof AxiosError) {
        const responseData = error.response?.data as
            | ApiErrorResponse
            | undefined;

        return responseData?.message ?? fallbackMessage;
    }

    return fallbackMessage;
};

/* =========================================================
   Initial State
========================================================= */

const initialState: AIGameState = {
    game: null,
    loading: false,
    error: null,
};

/* =========================================================
   CREATE AI GAME
========================================================= */

export const createAIGame = createAsyncThunk<
    AIGameConfig,
    CreateAIGamePayload,
    { rejectValue: string }
>(
    "aiGame/createAIGame",

    async (
        payload,
        { rejectWithValue }
    ) => {
        try {
            const response = await api.post<{
                data: AIGameConfig;
            }>(
                API_ROUTES.AI_GAME.GENERATE,
                payload
            );

            return response.data.data;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to create AI game"
                )
            );
        }
    }
);

/* =========================================================
   SLICE
========================================================= */

const aiGameSlice = createSlice({
    name: "aiGame",

    initialState,

    reducers: {
        clearAIGame: (state) => {
            state.game = null;
        },

        clearAIGameError: (state) => {
            state.error = null;
        },

        clearAIGameData: (state) => {
            state.game = null;
            state.loading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /* =============================================
               CREATE AI GAME - PENDING
            ============================================= */

            .addCase(
                createAIGame.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.game = null;
                }
            )

            /* =============================================
               CREATE AI GAME - SUCCESS
            ============================================= */

            .addCase(
                createAIGame.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.game = action.payload;
                }
            )

            /* =============================================
               CREATE AI GAME - ERROR
            ============================================= */

            .addCase(
                createAIGame.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload ??
                        "Failed to create AI game";
                }
            );
    },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
    clearAIGame,
    clearAIGameError,
    clearAIGameData,
} = aiGameSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default aiGameSlice.reducer;