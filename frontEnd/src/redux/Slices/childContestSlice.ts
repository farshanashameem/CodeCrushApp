import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../Lib/axios";

import type {
    AvailableContest,
    JoinedContest,
    ContestProgress,
    ContestLeaderboardItem,
    CompletedParticipant,
    JoinContestResponse,} from "../../Types/ChildContest"

import { API_ROUTES } from "../../Constants/api.routes";

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

export const getAvailableContests = createAsyncThunk(
    "childContest/getAvailableContests",

    async (childId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(
                API_ROUTES.CHILD.CONTEST.BASE,
                {
                    params: {
                        childId,
                    },
                }
            );

            return response.data.data.contests;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch available contests"
            );
        }
    }
);

export const getJoinedContests = createAsyncThunk(
    "childContest/getJoinedContests",

    async (childId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(
                API_ROUTES.CHILD.CONTEST.JOINED,
                {
                    params: {
                        childId,
                    },
                }
            );
          
            return response.data.data.contests;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch joined contests"
            );
        }
    }
);

export const joinContest = createAsyncThunk(
    "childContest/joinContest",

    async (
        {
            contestId,
            childId,
        }: {
            contestId: string;
            childId: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const url = API_ROUTES.CHILD.CONTEST.JOIN.replace(
                ":contestId",
                contestId
            );

            const response = await api.post(url, {
                childId,
            });

            return response.data as JoinContestResponse;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to join contest"
            );
        }
    }
);

export const getContestProgress = createAsyncThunk(
    "childContest/getContestProgress",

    async (
        {
            contestId,
            childId,
        }: {
            contestId: string;
            childId: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const url = API_ROUTES.CHILD.CONTEST.PROGRESS.replace(
                ":contestId",
                contestId
            );

            const response = await api.get(url, {
                params: {
                    childId,
                },
            });



            return response.data?.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch contest progress"
            );
        }
    }
);



export const getContestLeaderboard = createAsyncThunk(
  "childContest/getContestLeaderboard",

  async (
    contestId: string,
    { rejectWithValue }
  ) => {
    try {
      const url = API_ROUTES.CHILD.CONTEST.LEADERBOARD.replace(
        ":contestId",
        contestId
      );

      const response = await api.get(url);

      console.log("Leaderboard response:", response.data);

      return response.data.data.leaderboard;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch contest leaderboard"
      );
    }
  }
);

export const getCompletedParticipants = createAsyncThunk(
    "childContest/getCompletedParticipants",

    async (
        contestId: string,
        { rejectWithValue }
    ) => {
        try {
            const url =
                API_ROUTES.CHILD.CONTEST.COMPLETED_PARTICIPANTS.replace(
                    ":contestId",
                    contestId
                );

            const response = await api.get(url);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch completed participants"
            );
        }
    }
);


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

            state.error = null;
        },
    },

    extraReducers: (builder) => {
    builder

        // =========================
        // Get Available Contests
        // =========================

        .addCase( getAvailableContests.pending, (state) => {
                state.loadingAvailable = true;
                state.error = null;
            }
        )

        .addCase( getAvailableContests.fulfilled, (state, action) => {
                state.loadingAvailable = false;
               
                state.availableContests = action.payload;
            }
        )

        .addCase( getAvailableContests.rejected, (state, action) => {
                state.loadingAvailable = false;
                state.error =
                    action.payload as string;
            }
        )


        // =========================
        // Get Joined Contests
        // =========================

        .addCase( getJoinedContests.pending, (state) => {
                state.loadingJoined = true;
                state.error = null;
            }
        )

        .addCase( getJoinedContests.fulfilled, (state, action) => {
                state.loadingJoined = false;
                state.joinedContests =
                    action.payload;
            }
        )

        .addCase( getJoinedContests.rejected, (state, action) => {
                state.loadingJoined = false;
                state.error =
                    action.payload as string;
            }
        )


        // =========================
        // Join Contest
        // =========================

        .addCase( joinContest.pending, (state) => {
                state.joiningContest = true;
                state.error = null;
            }
        )

        .addCase( joinContest.fulfilled, (state) => {
                state.joiningContest = false;

            }   
        )

        .addCase( joinContest.rejected, (state, action) => {
                state.joiningContest = false;
                state.error =
                    action.payload as string;
            }
        )


        // =========================
        // Get Contest Progress
        // =========================

        .addCase( getContestProgress.pending, (state) => {
                state.loadingProgress = true;
                state.error = null;
            }
        )

        .addCase( getContestProgress.fulfilled, (state, action) => {
                state.loadingProgress = false;
               
                state.selectedContestProgress = action.payload;
            }
        )

        .addCase( getContestProgress.rejected, (state, action) => {
                state.loadingProgress = false;
                state.error =
                    action.payload as string;
            }
        )



        // =========================
        // Get Leaderboard
        // =========================

        .addCase( getContestLeaderboard.pending, (state) => {
                state.loadingLeaderboard = true;
                state.error = null;
            }
        )

        .addCase( getContestLeaderboard.fulfilled, (state, action) => {
                state.loadingLeaderboard = false;
                state.leaderboard =  action.payload;
            }
        )

        .addCase( getContestLeaderboard.rejected, (state, action) => {
                state.loadingLeaderboard = false;
                state.error =
                    action.payload as string;
            }
        )


        // =========================
        // Get Completed Participants
        // =========================

        .addCase( getCompletedParticipants.pending, (state) => {
                state.loadingParticipants = true;
                state.error = null;
            }
        )

        .addCase( getCompletedParticipants.fulfilled, (state, action) => {
                state.loadingParticipants = false;
                state.completedParticipants =
                    action.payload.participants;
            }
        )

        .addCase( getCompletedParticipants.rejected, (state, action) => {
                state.loadingParticipants = false;
                state.error =
                    action.payload as string;
            }
        );
}
});

export const {
    clearContestError,
    clearContestProgress,
    clearContestData,
} = childContestSlice.actions;

export default childContestSlice.reducer;