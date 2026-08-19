import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";

import type {
    AIGameConfig,
    CreateAIGamePayload,
} from "../../Types/aiGame";

interface AIGameState {
    game: AIGameConfig | null;
    loading: boolean;
    error: string | null;
}

const initialState: AIGameState = {
    game: null,
    loading: false,
    error: null,
};

/* ========================================================= */
/* CREATE AI GAME */
/* ========================================================= */

export const createAIGame = createAsyncThunk(
    "aiGame/createAIGame",

    async (
        payload: CreateAIGamePayload,
        { rejectWithValue }
    ) => {
        try {
            const response = await api.post(
                API_ROUTES.AI_GAME.GENERATE,
                payload
            );

            

            return response.data?.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create AI game"
            );
        }
    }
);

/* ========================================================= */
/* SLICE */
/* ========================================================= */

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

            /* ============================================= */
            /* CREATE AI GAME */
            /* ============================================= */

            .addCase(
                createAIGame.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.game = null;
                }
            )

            .addCase(
                createAIGame.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.game = action.payload;
                }
            )

            .addCase(
                createAIGame.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload as string;
                }
            );
    },
});

export const {
    clearAIGame,
    clearAIGameError,
    clearAIGameData,
} = aiGameSlice.actions;

export default aiGameSlice.reducer;