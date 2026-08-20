export interface GetGameReviewInputDTO {
    childId: string;
    gameId: string;
}


export interface GetGameReviewOutputDTO {
    id: string;
    childId: string;
    gameId: string;
    rating: number;
    review?: string;
    createdAt?: Date;
    updatedAt?: Date;
}