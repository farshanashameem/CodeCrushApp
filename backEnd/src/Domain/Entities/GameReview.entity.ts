export default class GameReviewEntity {

    private id?: string;

    private childId: string;

    private gameId: string;

    private rating: number;

    private review?: string;

    private createdAt?: Date;

    private updatedAt?: Date;

    constructor(
        childId: string,
        gameId: string,
        rating: number,
        review?: string,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.childId = childId;
        this.gameId = gameId;
        this.rating = rating;
        this.review = review;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
    }

    public getId(): string | undefined {
        return this.id;
    }

    public getChildId(): string {
        return this.childId;
    }

    public getGameId(): string {
        return this.gameId;
    }

    public getRating(): number {
        return this.rating;
    }

    public getReview(): string | undefined {
        return this.review;
    }

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    public setRating(rating: number): void {
        this.rating = rating;
    }

    public setReview(review?: string): void {
        this.review = review;
    }
}