export default class ChildSessionEntity {
  constructor(
    private childId: string,
    private parentId: string,
    private sessionToken: string,

    private isActive: boolean = true,

    private startedAt: Date = new Date(),

    private lastActivity: Date = new Date(),

    private expiresAt: Date = new Date(
      Date.now() +  12 * 60 * 60 * 1000
    ),

    private id?: string
  ) {}

  public getId() {
    return this.id;
  }

  public getChildId() {
    return this.childId;
  }

  public getParentId() {
    return this.parentId;
  }

  public getSessionToken() {
    return this.sessionToken;
  }

  public getStartedAt() {
  return this.startedAt;
}

  public getLastActivity() {
    return this.lastActivity;
  }

  public getExpiresAt() {
    return this.expiresAt;
  }

  public isSessionActive() {
    return this.isActive;
  }

  public updateActivity() {
    this.lastActivity = new Date();
    this.expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
  }

  public deactivate() {
    this.isActive = false; 
    this.expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);  
  }
}