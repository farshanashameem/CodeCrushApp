export default class ChildGameEntity {
    private gameId: string;
    private gameName: string;
    private currentLevel : number;
    private currentLevelHighScore : number;
    private playTime: number;
    private totalScore: number;
    private averageScore: number;
    private lastPlayedAt?: Date;

    constructor (
        gameId: string,
        gameName: string,
        currentLevel: number =1,
        currentLevelHighScore: number = 0,
        playTime: number=0,
        totalScore: number=0,
        averageScore: number = 0,
        lastPlayedAt : Date
    ) {
        this.gameId = gameId;
        this.gameName = gameName;
        this.currentLevel = currentLevel;
        this.currentLevelHighScore = currentLevelHighScore;
        this.playTime = playTime;
        this.totalScore = totalScore;
        this.averageScore = averageScore;
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

  public getCurrentLevelHighScore() : number {
    return this.currentLevelHighScore;
  }

  public getPlayTime(): number {
    return this.playTime;
  }

  public getTotalScore(): number {
    return this.totalScore;
  }

  public getAverageScore(): number {
    return this.averageScore;
  }

  public getLastPlayedAt() : Date | undefined {

    return this.lastPlayedAt;
  }

}