import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import api from "../../Lib/axios";

import type {
    AvailableContest,
    JoinedContest,
    ContestProgress,
    ContestLeaderboardItem,
    CompletedParticipant,
    JoinContestResponse,
} from "../../Types/ChildContest";

import { API_ROUTES } from "../../Constants/api.routes";

/* =========================================================
   Response Types
========================================================= */

interface ContestListResponse<T> {
    data: {
        contests: T[];
    };
}

interface ContestProgressResponse {
    data: ContestProgress;
}

interface ContestLeaderboardResponse {
    data: {
        leaderboard: ContestLeaderboardItem[];
    };
}

interface CompletedParticipantsResponse {
    participants: CompletedParticipant[];
}

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
   State
========================================================= */

interface ChildContestState {
    availableContests: AvailableContest[];
    joinedContests: JoinedContest[];

    selectedContestProgress: ContestProgress | null;

    leaderboard: ContestLeaderboardItem[];
    completedParticipants: CompletedParticipant[];

    loadingAvailable: boolean;
    loadingJoined: boolean;
    loadingProgress: boolean;
    loadingLeaderboard: boolean;
    loadingParticipants: boolean;

    joiningContest: boolean;
    updatingProgress: boolean;

    error: string | null;
}

/* =========================================================
   Initial State
========================================================= */

const initialState: ChildContestState = {
    availableContests: [],
    joinedContests: [],

    selectedContestProgress: null,

    leaderboard: [],
    completedParticipants: [],

    loadingAvailable: false,
    loadingJoined: false,
    loadingProgress: false,
    loadingLeaderboard: false,
    loadingParticipants: false,

    joiningContest: false,
    updatingProgress: false,

    error: null,
};

/* =========================================================
   Get Available Contests
========================================================= */

export const getAvailableContests = createAsyncThunk<
    AvailableContest[],
    string,
    { rejectValue: string }
>(
    "childContest/getAvailableContests",

    async (childId, { rejectWithValue }) => {
        try {
            const response = await api.get<
                ContestListResponse<AvailableContest>
            >(
                API_ROUTES.CHILD.CONTEST.BASE,
                {
                    params: {
                        childId,
                    },
                }
            );

            return response.data.data.contests;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to fetch available contests"
                )
            );
        }
    }
);

/* =========================================================
   Get Joined Contests
========================================================= */

export const getJoinedContests = createAsyncThunk<
    JoinedContest[],
    string,
    { rejectValue: string }
>(
    "childContest/getJoinedContests",

    async (childId, { rejectWithValue }) => {
        try {
            const response = await api.get<
                ContestListResponse<JoinedContest>
            >(
                API_ROUTES.CHILD.CONTEST.JOINED,
                {
                    params: {
                        childId,
                    },
                }
            );

            return response.data.data.contests;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to fetch joined contests"
                )
            );
        }
    }
);

/* =========================================================
   Join Contest
========================================================= */

export const joinContest = createAsyncThunk<
    JoinContestResponse,
    {
        contestId: string;
        childId: string;
    },
    { rejectValue: string }
>(
    "childContest/joinContest",

    async (
        {
            contestId,
            childId,
        },
        { rejectWithValue }
    ) => {
        try {
            const url = API_ROUTES.CHILD.CONTEST.JOIN.replace(
                ":contestId",
                contestId
            );

            const response = await api.post<JoinContestResponse>(
                url,
                {
                    childId,
                }
            );

            return response.data;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to join contest"
                )
            );
        }
    }
);

/* =========================================================
   Get Contest Progress
========================================================= */

export const getContestProgress = createAsyncThunk<
    ContestProgress,
    {
        contestId: string;
        childId: string;
    },
    { rejectValue: string }
>(
    "childContest/getContestProgress",

    async (
        {
            contestId,
            childId,
        },
        { rejectWithValue }
    ) => {
        try {
            const url = API_ROUTES.CHILD.CONTEST.PROGRESS.replace(
                ":contestId",
                contestId
            );

            const response = await api.get<ContestProgressResponse>(
                url,
                {
                    params: {
                        childId,
                    },
                }
            );

            return response.data.data;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to fetch contest progress"
                )
            );
        }
    }
);

/* =========================================================
   Get Contest Leaderboard
========================================================= */

export const getContestLeaderboard = createAsyncThunk<
    ContestLeaderboardItem[],
    string,
    { rejectValue: string }
>(
    "childContest/getContestLeaderboard",

    async (
        contestId,
        { rejectWithValue }
    ) => {
        try {
            const url =
                API_ROUTES.CHILD.CONTEST.LEADERBOARD.replace(
                    ":contestId",
                    contestId
                );

            const response =
                await api.get<ContestLeaderboardResponse>(
                    url
                );

            return response.data.data.leaderboard;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to fetch contest leaderboard"
                )
            );
        }
    }
);

/* =========================================================
   Get Completed Participants
========================================================= */

export const getCompletedParticipants = createAsyncThunk<
    CompletedParticipantsResponse,
    string,
    { rejectValue: string }
>(
    "childContest/getCompletedParticipants",

    async (
        contestId,
        { rejectWithValue }
    ) => {
        try {
            const url =
                API_ROUTES.CHILD.CONTEST.COMPLETED_PARTICIPANTS.replace(
                    ":contestId",
                    contestId
                );

            const response =
                await api.get<CompletedParticipantsResponse>(
                    url
                );

            return response.data;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to fetch completed participants"
                )
            );
        }
    }
);

/* =========================================================
   Slice
========================================================= */

const childContestSlice = createSlice({
    name: "childContest",

    initialState,

    reducers: {
        clearContestError: (state) => {
            state.error = null;
        },

        clearContestProgress: (state) => {
            state.selectedContestProgress = null;
        },

        clearContestData: (state) => {
            state.availableContests = [];
            state.joinedContests = [];
            state.selectedContestProgress = null;
            state.leaderboard = [];
            state.completedParticipants = [];

            state.loadingAvailable = false;
            state.loadingJoined = false;
            state.loadingProgress = false;
            state.loadingLeaderboard = false;
            state.loadingParticipants = false;

            state.joiningContest = false;
            state.updatingProgress = false;

            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /* =================================================
               Get Available Contests
            ================================================= */

            .addCase(
                getAvailableContests.pending,
                (state) => {
                    state.loadingAvailable = true;
                    state.error = null;
                }
            )

            .addCase(
                getAvailableContests.fulfilled,
                (state, action) => {
                    state.loadingAvailable = false;
                    state.availableContests = action.payload;
                }
            )

            .addCase(
                getAvailableContests.rejected,
                (state, action) => {
                    state.loadingAvailable = false;
                    state.error =
                        action.payload ??
                        "Failed to fetch available contests";
                }
            )

            /* =================================================
               Get Joined Contests
            ================================================= */

            .addCase(
                getJoinedContests.pending,
                (state) => {
                    state.loadingJoined = true;
                    state.error = null;
                }
            )

            .addCase(
                getJoinedContests.fulfilled,
                (state, action) => {
                    state.loadingJoined = false;
                    state.joinedContests = action.payload;
                }
            )

            .addCase(
                getJoinedContests.rejected,
                (state, action) => {
                    state.loadingJoined = false;
                    state.error =
                        action.payload ??
                        "Failed to fetch joined contests";
                }
            )

            /* =================================================
               Join Contest
            ================================================= */

            .addCase(
                joinContest.pending,
                (state) => {
                    state.joiningContest = true;
                    state.error = null;
                }
            )

            .addCase(
                joinContest.fulfilled,
                (state) => {
                    state.joiningContest = false;
                }
            )

            .addCase(
                joinContest.rejected,
                (state, action) => {
                    state.joiningContest = false;
                    state.error =
                        action.payload ??
                        "Failed to join contest";
                }
            )

            /* =================================================
               Get Contest Progress
            ================================================= */

            .addCase(
                getContestProgress.pending,
                (state) => {
                    state.loadingProgress = true;
                    state.error = null;
                }
            )

            .addCase(
                getContestProgress.fulfilled,
                (state, action) => {
                    state.loadingProgress = false;
                    state.selectedContestProgress =
                        action.payload;
                }
            )

            .addCase(
                getContestProgress.rejected,
                (state, action) => {
                    state.loadingProgress = false;
                    state.error =
                        action.payload ??
                        "Failed to fetch contest progress";
                }
            )

            /* =================================================
               Get Leaderboard
            ================================================= */

            .addCase(
                getContestLeaderboard.pending,
                (state) => {
                    state.loadingLeaderboard = true;
                    state.error = null;
                }
            )

            .addCase(
                getContestLeaderboard.fulfilled,
                (state, action) => {
                    state.loadingLeaderboard = false;
                    state.leaderboard = action.payload;
                }
            )

            .addCase(
                getContestLeaderboard.rejected,
                (state, action) => {
                    state.loadingLeaderboard = false;
                    state.error =
                        action.payload ??
                        "Failed to fetch contest leaderboard";
                }
            )

            /* =================================================
               Get Completed Participants
            ================================================= */

            .addCase(
                getCompletedParticipants.pending,
                (state) => {
                    state.loadingParticipants = true;
                    state.error = null;
                }
            )

            .addCase(
                getCompletedParticipants.fulfilled,
                (state, action) => {
                    state.loadingParticipants = false;
                    state.completedParticipants =
                        action.payload.participants;
                }
            )

            .addCase(
                getCompletedParticipants.rejected,
                (state, action) => {
                    state.loadingParticipants = false;
                    state.error =
                        action.payload ??
                        "Failed to fetch completed participants";
                }
            );
    },
});

/* =========================================================
   Actions
========================================================= */

export const {
    clearContestError,
    clearContestProgress,
    clearContestData,
} = childContestSlice.actions;

/* =========================================================
   Reducer
========================================================= */

export default childContestSlice.reducer;