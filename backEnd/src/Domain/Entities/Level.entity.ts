import { LevelConfig } from "@/Domain/Types/Config";

export default class LevelEntity {
    constructor(
        private gameId: string,
        private levelNumber: number,
        private difficulty: "easy" | "medium" | "hard",
        private timer: number,
        private maxScore: number,
        private config: LevelConfig,
        private id?: string,
        private isActive: boolean = true,
        private createdAt: Date = new Date(),
        private updatedAt?: Date
    ) {}

    public getId(): string | undefined {
        return this.id;
    }

    public getGameId(): string {
        return this.gameId;
    }

    public getLevelNumber(): number {
        return this.levelNumber;
    }

    public getDifficulty(): "easy" | "medium" | "hard" {
        return this.difficulty;
    }

    public getTimer(): number {
        return this.timer;
    }

    public getMaxScore(): number {
        return this.maxScore;
    }

    public getConfig(): LevelConfig {
        return this.config;
    }

    public isLevelActive(): boolean {
        return this.isActive;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}