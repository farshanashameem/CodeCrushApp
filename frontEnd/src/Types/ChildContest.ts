import type { ContestType, ContestWinner, WinnerCriteria } from "./ContestManagement";


// =========================
// Available Contests
// =========================


export interface AvailableContest {
    id: string;
    title: string;
    description: string;
    type: ContestType;
    gameIds: string[];
    startDate: string;
    endDate: string;
}

export interface GetAvailableContestsResponse {
    contests: AvailableContest[];
}


// =========================
// Joined Contests
// =========================

export interface JoinedContest {
    contestId: string;
    title: string;
    description: string;
    type: ContestType;
    gameIds: string[];

    winnerCriteria: WinnerCriteria;
    targetValue?: number;

    score: number;
    stars: number;
    levelsCompleted: number;

    completed: boolean;
    joinedAt: string;

    startDate: string;
    endDate: string;
}

export interface GetJoinedContestsResponse {
    contests: JoinedContest[];
}


export interface Contest {
  id?: string;
  title: string;
  description: string;
  type: ContestType;
  gameIds?: string[];
  winnerCriteria?: WinnerCriteria;
  targetValue?: number;
  startDate: string;
  endDate: string;
  status?: string;
  winners?: ContestWinner[];
}

// =========================
// Join Contest
// =========================

export interface JoinContestResponse {
    id: string;
    contestId: string;
    childId: string;
    completed: boolean;
    joinedAt: string;
}


// =========================
// Contest Progress
// =========================

export interface ContestProgress {
    contestId: string;
    childId: string;
    score: number;
    stars: number;
    levelsCompleted: number;
    completed: boolean;
    joinedAt: string;
}


// =========================
// Update Contest Progress
// =========================

export interface UpdateContestProgressRequest {
    contestId: string;
    childId: string;
    score: number;
    stars: number;
    levelsCompleted: number;
}

export interface ContestStats {
    score: number;
    stars: number;
    levelsCompleted: number;
}

export interface UpdateContestProgressResponse {
    contestId: string;
    childId: string;
    stats: ContestStats;
    completed: boolean;
}


// =========================
// Leaderboard
// =========================

export interface ContestLeaderboardItem {
    rank: number;
    childId: string;
    childName: string;
    avatar: string;
    score: number;
    stars: number;
    levelsCompleted: number;
    completed: boolean;
}

export interface GetContestLeaderboardResponse {
    leaderboard: ContestLeaderboardItem[];
}


// =========================
// Completed Participants
// =========================

export interface CompletedParticipant {
    childId: string;
    score: number;
    stars: number;
    levelsCompleted: number;
    joinedAt: string;
}

export interface GetCompletedParticipantsResponse {
    participants: CompletedParticipant[];
}