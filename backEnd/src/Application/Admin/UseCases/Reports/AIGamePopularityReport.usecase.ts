import { IAIGamePopularityRepository } from '@/Domain/RepositoryInterface/IGamePopularity.repository';
import { AIGamePopularityReportData } from '../../dto/AIGamePopularityReport.dto';
import { IAIGamePopularityReportUseCase } from '../../Interfaces/Report/IAIGamePopularityReport.usecase';

export class GetAIGamePopularityReport
    implements IAIGamePopularityReportUseCase
{
    constructor(
        private _aiGamePopularityRepo: IAIGamePopularityRepository
    ) {}

    async execute(): Promise<AIGamePopularityReportData[]> {
        const data = await this._aiGamePopularityRepo.findAll();
         return data.map((r) => ({
            gameType: r.getGameType(),
            difficulty: r.getDifficulty(),
            creationCount: r.getCreationCount(),
        }));
    }
}