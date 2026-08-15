import { ContestStats } from '../Types/ContestStats';

export default class ContestProgressEntity {

    private id?: string;

    private contestId: string;

    private childId: string;

    private stats: ContestStats;
    private completedLevelIds: string[];

    private completed: boolean;

    private joinedAt: Date;

    private createdAt?: Date;

    private updatedAt?: Date;

    constructor(
        contestId: string,
        childId: string,
        stats: ContestStats,
        completedLevelIds: string[] = [],
        completed: boolean = false,
        joinedAt: Date = new Date(),
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.contestId = contestId;
        this.childId = childId;
        this.stats = stats;
        this.completedLevelIds = completedLevelIds;
        this.completed = completed;
        this.joinedAt = joinedAt;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
    }

    public getId() : string | undefined  {
        return this.id;
    }

    public getContestId(): string {
        return this.contestId;
    }

    public getChildId(): string {
        return this.childId;
    }

    public getStats(): ContestStats {
        return this.stats;
    }

     public getCompletedLevelIds(): string[] {
        return this.completedLevelIds;
    }

     public addCompletedLevel(levelId: string): void {
        if (!this.completedLevelIds.includes(levelId)) {
            this.completedLevelIds.push(levelId);
        }
    }

    public isCompleted(): boolean {
        return this.completed;
    }

    public getJoinedAt(): Date {
        return this.joinedAt;
    }
}