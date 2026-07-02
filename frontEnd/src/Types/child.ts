export interface childPayload {
    id: string;
    name: string;
    age: string;
    dob?: Date;
}

export interface ChildListItem {
  id: string;
  name: string;
  age: number;
  avatar: string;
  status: string;
}

export interface CurrentChild {
  id: string;
  parentId: string;
  name: string;
  age: number;
  avatar: string;
  totalPlayTime: number;
  totalGamesPlayed: number;
  lastPlayed?: string;

  games: {
    gameId: string;
    gameName: string;
    currentLevel: number;
    totalStars: number;
    playTime: number;
    totalScore: number;
    totalAttempts: number;
    lastPlayedAt?: string;
  }[];
}