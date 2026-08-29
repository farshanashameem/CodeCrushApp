export interface GameReview {
  id: string;
  childId: string;
  gameId: string;
  rating: number;
  review?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGameReviewPayload {
  childId: string;
  gameId: string;
  rating: number;
  review?: string;
}

export interface GetGameReviewPayload {
  childId: string;
  gameId: string;
}

export interface GameReviewWithChildName {
  id: string;
  childId: string;
  childName: string;
  gameId: string;
  rating: number;
  review?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetGameReviewsResponse {
  reviews: GameReviewWithChildName[];
  averageRating: number;
  totalReviews: number;
}

export interface GameReviewState {
  loading: boolean;
  error: string | null;
  selectedReview: GameReview | null;
  reviews: GameReviewWithChildName[];
  averageRating: number;
  totalReviews: number;
}