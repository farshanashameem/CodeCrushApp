export interface GetGameReviewsInputDTO {
    gameId: string;
}

export interface GameReviewOutputDTO {
    id: string;
    childName: string;
    gameId: string;
    rating: number;
    review?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface GetGameReviewsOutputDTO {
    reviews: GameReviewOutputDTO[];
    averageRating: number;
    totalReviews: number;
}