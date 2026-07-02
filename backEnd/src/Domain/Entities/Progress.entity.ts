export default class ProgressEntity {
  constructor(
    private childId: string,
    private gameId: string,
    private levelId: string,

    private highScore: number = 0,
    private stars: number = 0,

    private completed: boolean = false,

    private totalAttempts: number = 0,
    private bestTime: number = 0,
    private totalMistakes: number = 0, 

    private lastPlayedAt?: Date,

    private id?: string,

    private createdAt: Date = new Date(),
    private updatedAt?: Date
  ) {}

  getId() {
    return this.id;
  }

  getChildId() {
    return this.childId;
  }

  getGameId() {
    return this.gameId;
  }

  getLevelId() {
    return this.levelId;
  }

  getHighScore() {
    return this.highScore;
  }

  getStars() {
    return this.stars;
  }

  isCompleted() {
    return this.completed;
  }

  getTotalAttempts() {
    return this.totalAttempts;
  }

  getBestTime() {
    return this.bestTime;
  }

  getTotalMistakes() {
    return this.totalMistakes;
  }

  getLastPlayedAt() {
    return this.lastPlayedAt;
  }
}