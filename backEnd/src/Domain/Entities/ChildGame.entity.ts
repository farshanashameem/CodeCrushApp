export default class ChildGameEntity {
    private gameId: string;
    private gameName: string;
    private currentLevel : number;
    private totalStars: number;
    private playTime: number;
    private totalScore: number;
    private totalAttempts: number ;
    private lastPlayedAt?: Date;

    constructor (
        gameId: string,
        gameName: string,
        currentLevel: number =1,
        totalStars: number = 0,
        playTime: number=0,
        totalScore: number=0,
        totalAttempts: number = 0,
        lastPlayedAt : Date
    ) {
        this.gameId = gameId;
        this.gameName = gameName;
        this.currentLevel = currentLevel;
        this.totalStars= totalStars;
        this.playTime = playTime;
        this.totalScore = totalScore;
        this.totalAttempts = totalAttempts;
        this.lastPlayedAt = lastPlayedAt;
    }

  public getGameId() : string {
    return this.gameId;
  }

  public getGameName(): string {
    return this.gameName;
  }

  public getCurrentLevel(): number {
    return this.currentLevel;
  }

  public getTotalStars() : number {
    return this.totalStars;
  }

  public getPlayTime(): number {
    return this.playTime;
  }

  public getTotalScore(): number {
    return this.totalScore;
  }

 getTotalAttempts() { return this.totalAttempts; }

  public getLastPlayedAt() : Date | undefined {

    return this.lastPlayedAt;
  }

}