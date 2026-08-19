import AIGameType from '@/Domain/enums/AIGameType.enum';
import AIGameDifficulty from '@/Domain/enums/AIGameDifficulty.enum';

export default class AIGamePopularityEntity {
    constructor(
        private gameType: AIGameType,
        private difficulty: AIGameDifficulty,
        private creationCount: number = 0,
        private id?: string,
        private createdAt: Date = new Date(),
        private updatedAt?: Date,
    ) {}

    public getId(): string | undefined {
        return this.id;
    }

    public getGameType(): AIGameType {
        return this.gameType;
    }

    public getDifficulty(): AIGameDifficulty {
        return this.difficulty;
    }

    public getCreationCount(): number {
        return this.creationCount;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    public incrementCreationCount(): void {
        this.creationCount++;
    }
}