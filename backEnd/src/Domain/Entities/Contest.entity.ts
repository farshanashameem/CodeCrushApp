import ContestStatus from '../enums/ContestStatus.enum';
import ContestType from '../enums/ContestType.enum';
import WinnerCriteria from '../enums/WinnerCriteria.enum';
import { ContestWinner } from '../Types/ContestWinner';

export default class ContestEntity {

    private id?: string;

    private title: string;

    private description: string;

    private type: ContestType;

    private gameIds: string[];

    private winnerCriteria?: WinnerCriteria;

    private targetValue?: number;

    private startDate: Date;

    private endDate: Date;

    private status: ContestStatus;

    private winners: ContestWinner[];

    private createdAt?: Date;

    private updatedAt?: Date;

    constructor(
        title: string,
        description: string,
        type: ContestType,
        gameIds: string[],
        startDate: Date,
        endDate: Date,
        status: ContestStatus,
        winners: ContestWinner[] = [],
        winnerCriteria?: WinnerCriteria,
        targetValue?: number,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.gameIds = gameIds;
        this.winnerCriteria = winnerCriteria;
        this.targetValue = targetValue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.winners = winners;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
    }

    public getId(): string | undefined {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getDescription(): string {
        return this.description;
    }

    public getType(): ContestType {
        return this.type;
    }

    public getGameIds(): string[] {
        return this.gameIds;
    }

    public getWinnerCriteria(): WinnerCriteria | undefined {
        return this.winnerCriteria;
    }

    public getTargetValue(): number | undefined {
        return this.targetValue;
    }

    public getStartDate(): Date {
        return this.startDate;
    }

    public getEndDate(): Date {
        return this.endDate;
    }

    public getStatus(): ContestStatus {
        return this.status;
    }

    public getWinners(): ContestWinner[] {
        return this.winners;
    }

    public setWinners(winners: ContestWinner[]): void {
        this.winners = winners;
    }

    public setTitle(title: string): void {
    this.title = title;
}

public setDescription(description: string): void {
    this.description = description;
}

public setType(type: ContestType): void {
    this.type = type;
}

public setGameIds(gameIds: string[]): void {
    this.gameIds = gameIds;
}

public setWinnerCriteria(winnerCriteria?: WinnerCriteria): void {
    this.winnerCriteria = winnerCriteria;
}

public setTargetValue(targetValue?: number): void {
    this.targetValue = targetValue;
}

public setStartDate(startDate: Date): void {
    this.startDate = startDate;
}

public setEndDate(endDate: Date): void {
    this.endDate = endDate;
}

public setStatus(status: ContestStatus): void {
    this.status = status;
}
}