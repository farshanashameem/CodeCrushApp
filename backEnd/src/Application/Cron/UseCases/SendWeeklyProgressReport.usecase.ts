import { IParentRepository } from "@/Domain/RepositoryInterface/IParent.repository";
import { IChildRepository } from "@/Domain/RepositoryInterface/IChild.repository";
import { IProgressRepository } from "@/Domain/RepositoryInterface/IProgress.repository";
import { IEmailService } from "@/Application/Interfaces/Services/IEmailService";
import { ISendWeeklyProgressReportUseCase } from "../Interfaces/ISendWeeklyProgressReport.usecase";
import { WeeklyChildProgressDTO, WeeklyGameProgressDTO, WeeklyProgressReportDTO } from "../dto/WeeklyProgressReport.dto";

export class SendWeeklyProgressReportUseCase
    implements ISendWeeklyProgressReportUseCase {

    constructor(
        private _parentRepository: IParentRepository,
        private _childRepository: IChildRepository,
        private _progressRepository: IProgressRepository,
        private _mailService: IEmailService,
    ) {}

    async execute(): Promise<void> {
        const to = new Date();
        const from = new Date();
        from.setDate( to.getDate() - 7);
        const parents = await this._parentRepository.findPremiumParents();
        
        for( const parent of parents ) {

            const children = await this._childRepository.findByParentId( parent.getId()!);
            const childReports:WeeklyChildProgressDTO[] =[];

            for( const child of children ) {

                const gameReports: WeeklyGameProgressDTO[] = [];

                for( const game of child.getGames()) {
                    const weeklyStats = await this._progressRepository.getWeeklyProgressStatistics( child.getId()!, game.getGameId(), from, to);
                    gameReports.push({
                        gameId: game.getGameId(),
                        gameName: game.getGameName(),
                        currentLevel: game.getCurrentLevel(),
                        levelsPlayedThisWeek: weeklyStats.levelsPlayedThisWeek,
                        levelsCompletedThisWeek: weeklyStats.levelsCompletedThisWeek,
                        highestScoreThisWeek: weeklyStats.highestScoreThisWeek,
                        bestTimeThisWeek: weeklyStats.bestTimeThisWeek,
                        averageStarsThisWeek: weeklyStats.averageStarsThisWeek
                    });
                }

                childReports.push({
                    childName: child.getName(),
                    totalGamesPlayed: child.getTotalGamesPlayed(),
                    totalPlayTime: child.getTotalPlayedTime(),
                    lastPlayed: child.getLastPlayed(),
                    games: gameReports
                })

            }

            const report: WeeklyProgressReportDTO = {
                parentName: parent.getName(),
                parentEmail: parent.getEmail(),
                children: childReports,
            };

            await this._mailService.sendWeeklyProgressReport(report);

        }
    }
}