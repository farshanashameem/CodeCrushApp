export interface Game {
  id: string;
  name: string;
  image: string;
  description: string;
  skillType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FetchGamesResponse {
  games: Game[];
}