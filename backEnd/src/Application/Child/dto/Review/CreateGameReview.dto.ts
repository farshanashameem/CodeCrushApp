export interface CreateGameReviewInputDTO {
  childId: string;
  gameId: string;
  rating: number;
  review?: string;
}

export interface CreateGameReviewOutputDTO {
  id: string;
  childId: string;
  gameId: string;
  rating: number;
  review?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
