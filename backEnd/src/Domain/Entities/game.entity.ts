
export default class GameEntity {
  constructor(
    private name: string,
    private image: string,
    private description: string,
    private skillType: string,
    private id?: string,
    private isActive: boolean = true,
    private createdAt: Date = new Date(),
    private updatedAt?: Date,
  ) {}

  public getId(): string | undefined {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getImage(): string {
    return this.image;
  }

  public getDescription(): string {
    return this.description;
  }

  public getSkillType(): string {
    return this.skillType;
  }

  public isGameActive(): boolean {
    return this.isActive;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}