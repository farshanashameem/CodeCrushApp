import ChildEntity from '@/Domain/Entities/Child.entity';
import { IChild, IChildGame } from '@/Infrastructure/Database/Model/ChildModel';
import ChildGameEntity from '@/Domain/Entities/ChildGame.entity';

export class ChildMapper {

    // DB → Entity
   static toEntity(doc: IChild): ChildEntity {

    const games = (doc.games ?? []).map(
        (g:IChildGame)=>

        new ChildGameEntity(
            g.gameId.toString(),
            g.gameName,
            g.currentLevel,
            g.totalStars,
            g.playTime,
            g.totalScore,
            g.totalAttempts,
            g.lastPlayedAt ?? new Date()

        )
    );

    return new ChildEntity(
        doc.parentId.toString(),
        doc.name,
        doc.age,
        doc.avatar,
        doc._id?.toString(),
        doc.dob,
        doc.createdAt,
        doc.deletedAt,
        doc.status,
        doc.blockedBy,
        doc.totalPlayTime,
        doc.totalGamesPlayed,
        doc.lastPlayed,
        doc.dailyLevelCount,
        doc.dailyLevelCountDate,
        games
    );
}

    // Entity → DB
    static toDocument(entity: ChildEntity) {

        return {
            parentId: entity.getParentId(),
            name: entity.getName(),
            age: entity.getAge(),
            dob: entity.getDob(),
            avatar: entity.getAvatar(),
            status: entity.getStatus(),
            blockedBy: entity.getBlockedBy(),
            deletedAt: entity.getDeletedAt(),
            totalPlayTime: entity.getTotalPlayedTime(),
            totalGamesPlayed: entity.getTotalGamesPlayed(),
            lastPlayed: entity.getLastPlayed(),
            dailyLevelCount: entity.getDailyLevelCount(),
            dailyLevelCountDate: entity.getDailyLevelCountDate(),

            games: entity.getGames().map(g => ({
                gameId: g.getGameId(),
                gameName: g.getGameName(),
                currentLevel: g.getCurrentLevel(),
                totalStars: g.getTotalStars(),
                playTime: g.getPlayTime(),
                totalScore: g.getTotalScore(),
                totalAttempts: g.getTotalAttempts(),
                lastPlayedAt: g.getLastPlayedAt()
            }))
        };
    }
}