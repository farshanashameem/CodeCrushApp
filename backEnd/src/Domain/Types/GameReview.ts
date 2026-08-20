import GameReviewEntity from '../Entities/GameReview.entity';

export interface GameReviewWithChildName {
    review: GameReviewEntity;
    childName: string;
}