import ChildGameEntity from './ChildGame.entity';
import UserStatus from '../enums/UserStatus.enum';
import BaseStatusEntity from './BaseStatus.entity';
import { IStatusEntity } from './IStatusEntity';
import { ChildUpdateData } from '../Types/ChildUpdateData';
import { BlockedBy } from '../enums/blockedBy.enum';

export default class ChildEntity extends BaseStatusEntity implements IStatusEntity{
  private id?: string;
  private parentId: string;
  private name: string;
  private age: number;
  private dob?: Date;
  private avatar: string;
  private blockedBy: BlockedBy | null;
  private createdAt: Date;
  private deletedAt?: Date;

  private totalPlayTime: number;
  private totalGamesPlayed: number;
  private lastPlayed?: Date;
  private _dailyLevelCount: number;
  private _dailyLevelCountDate?: Date;
  private games: ChildGameEntity[];

  constructor(
    parentId: string,
    name: string,
    age: number,
    avatar: string,
    id?: string,
    dob?: Date,
    createdAt?: Date,
    deletedAt?: Date,
    status: UserStatus = UserStatus.ACTIVE,
    blockedBy: BlockedBy | null = null,
    totalPlayedTime: number = 0,
    totalGamesPlayed: number = 0,
    lastPlayed?: Date,
    dailyLevelCount = 0,
    dailyLevelCountDate?: Date,
    games: ChildGameEntity[] = [],
  ) {
    super(status);

    this.parentId = parentId;
    this.name = name;
    this.age = age;
    this.dob = dob;
    this.avatar = avatar;
    this.blockedBy = blockedBy;
    this.id = id;
    this.createdAt = createdAt ?? new Date();
    this.deletedAt = deletedAt;
    this.totalGamesPlayed = totalGamesPlayed;
    this.totalPlayTime = totalPlayedTime;
    this.lastPlayed = lastPlayed;
    this._dailyLevelCount = dailyLevelCount;
    this._dailyLevelCountDate = dailyLevelCountDate;
    this.games = games;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getParentId(): string | undefined {
    return this.parentId;
  }

  public getName(): string {
    return this.name;
  }

  public getAge(): number {
    return this.age;
  }

  public getAvatar(): string {
    return this.avatar;
  }

  public getBlockedBy(): BlockedBy | null {
    return this.blockedBy;
  }

  public override delete(): void {
    super.delete();
    this.deletedAt = new Date();
  }

public override restore(): void {
    super.restore();
    this.deletedAt = undefined;
}

public getDeletedAt(): Date | undefined {
    return this.deletedAt;
}

  public setBlockedBy(blockedBy: BlockedBy): void {
      this.blockedBy = blockedBy;
  }

  public clearBlockedBy(): void {
    this.blockedBy = null;
  }

  public getDob(): Date | undefined {
    return this.dob;
  }

  public getGames(): ChildGameEntity[] {
    return this.games;
  }

  public getLastPlayed(): Date | undefined {
    return this.lastPlayed;
  }

  getDailyLevelCount(): number {
      return this._dailyLevelCount;
  }

  getDailyLevelCountDate(): Date | undefined {
      return this._dailyLevelCountDate;
  }

  public getTotalGamesPlayed(): number {
    return this.totalGamesPlayed;
  }

  public getTotalPlayedTime(): number {
    return this.totalPlayTime;
  }

   public update(data: ChildUpdateData): void {

    if (data.name !== undefined) {
      this.name = data.name;
    }

    if (data.age !== undefined) {
      this.age = data.age;
    }

    if (data.avatar !== undefined) {
      this.avatar = data.avatar;
    }

    if (data.dob !== undefined) {
      this.dob = data.dob;
    }
  }

  public replaceGame(updatedGame: ChildGameEntity): void {
  this.games = this.games.map(game =>
    game.getGameId() === updatedGame.getGameId()
      ? updatedGame
      : game
  );
}

public setLastPlayed(date: Date): void {
  this.lastPlayed = date;
}

public setTotalPlayedTime(time: number): void {
  this.totalPlayTime = time;
}

public setTotalGamesPlayed(count: number): void {
  this.totalGamesPlayed = count;
}

public addGame(game: ChildGameEntity): void {
  this.games.push(game);
}

resetDailyLevelCount(date: Date): void {
    this._dailyLevelCount = 0;
    this._dailyLevelCountDate = date;
}

incrementDailyLevelCount(): void {
    this._dailyLevelCount += 1;
}

}
