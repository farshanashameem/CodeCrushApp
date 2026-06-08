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

  private totalPlayTime: number;
  private totalGamesPlayed: number;
  private lastPlayed?: Date;
  private games: ChildGameEntity[];

  constructor(
    parentId: string,
    name: string,
    age: number,
    avatar: string,
    id?: string,
    dob?: Date,
    createdAt?: Date,
    status: UserStatus = UserStatus.ACTIVE,
    blockedBy: BlockedBy | null = null,
    totalPlayedTime: number = 0,
    totalGamesPlayed: number = 0,
    lastPlayed?: Date,
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
    this.totalGamesPlayed = totalGamesPlayed;
    this.totalPlayTime = totalPlayedTime;
    this.lastPlayed = lastPlayed;
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

}
