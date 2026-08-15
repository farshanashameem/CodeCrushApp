export type ChildStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface ChildGame {
  gameId: string;
  gameName: string;
  currentLevel: number;
  totalStars: number;
  playTime: number;
  totalScore: number;
  totalAttempts: number;
  lastPlayed?: string;
}

export interface Child {
  id: string;
  parentId: string;

  name: string;
  age: number;
  avatar: string;
  dob?: string;

  status: ChildStatus;

  totalPlayTime: number;
  totalGamesPlayed: number;

  lastPlayed?: string;
  createdAt?: string;
  games: ChildGame[];
}

export interface ChildState {
  loading: boolean;
  error: string | null;

  children: Child[];

  selectedChild: Child | null;
}

export interface FetchChildrenResponse {
  children: Child[];
}

export interface GetChildDetailPayload {
  child: Child;
  games: ChildGame[];
}

export interface AddChildPayload {
  name: string;
  age: number;
  avatar: string;
  dob?: string;
}

export interface UpdateChildPayload {
  id: string;

  name?: string;
  age?: number;
  avatar?: string;
  dob?: string;
}

export interface ToggleChildStatusArgs {
  id: string;

  action: "BLOCK" | "UNBLOCK" | "DELETE" | "RESTORE";
}

export interface ToggleChildStatusPayload {
  id: string;
  status: ChildStatus;
}
