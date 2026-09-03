import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { IGetDashboardStatsUseCase } from '../Interfaces/IGetDashBoardStats.usecase';
import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { ILevelRepository } from '@/Domain/RepositoryInterface/ILevel.repository';
import { DashboardStatsDTO } from '../dto/DashboardStats.dto';

export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {

    constructor(
        private readonly parentRepository: IParentRepository,
        private readonly childRepository: IChildRepository,
        private readonly levelRepository: ILevelRepository
    ) {}

    async execute(): Promise<DashboardStatsDTO> {

        const [
            totalParents,
            totalChildren,
            totalLevels
        ] = await Promise.all([
            this.parentRepository.countParents(),
            this.childRepository.countChildren(),
            this.levelRepository.countLevels()
        ]);

        return {
            totalParents,
            totalChildren,
            totalGames: 4,
            totalLevels
        };
    }
}