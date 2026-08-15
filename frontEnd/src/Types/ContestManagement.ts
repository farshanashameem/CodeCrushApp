export const ContestType = {
  CHALLENGE: "CHALLENGE",
  PARTICIPATION: "PARTICIPATION",
} as const;

export type ContestType = (typeof ContestType)[keyof typeof ContestType];

export const WinnerCriteria = {
  SCORE: "SCORE",
  STARS: "STARS",
  LEVELS: "LEVELS",
} as const;

export type WinnerCriteria = (typeof WinnerCriteria)[keyof typeof WinnerCriteria];



export interface Contest {
  id: string;
  title: string;
  description: string;
  type: ContestType;
  gameIds?: string[];
  winnerCriteria?: WinnerCriteria;
  targetValue?: number;
  startDate: string;
  endDate: string;
  status: string;
  winners?: ContestWinner[];
}

export interface ContestWinner {
    childId: string;
    childName: string;
    avatar: string;
    reward: string;
    earnedAt: string;
}

export interface CreateContestPayload {
  title: string;
  description: string;
  type: ContestType;
  gameIds?: string[];
  winnerCriteria: WinnerCriteria;
  targetValue?: number;
  startDate: string;
  endDate: string;
}

export interface UpdateContestPayload {
  id: string;
  title: string;
  description: string;
  type: ContestType;
  gameIds?: string[];
  winnerCriteria?: WinnerCriteria;
  targetValue?: number;
  startDate: string;
  endDate: string;
}

export type FetchContestsResponse = Contest[];

export interface ContestState {
  loading: boolean;
  detailsLoading: boolean;
  error: string | null;
  contests: Contest[];
  selectedContest: Contest | null;
}