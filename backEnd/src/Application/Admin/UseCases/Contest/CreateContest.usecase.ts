import { IContestRepository } from '@/Domain/RepositoryInterface/IContest.repository';
import { CreateContestInputDTO, CreateContestOutputDTO } from '../../dto/Contest/createContest.dto';
import ContestEntity from '@/Domain/Entities/Contest.entity';
import ContestStatus from '@/Domain/enums/ContestStatus.enum';
import { ICreateContestUseCase } from '../../Interfaces/Contest/ICreateContest.usecase';

export class CreateContestUseCase implements ICreateContestUseCase {
    constructor(
        private _contestRepo: IContestRepository
    ) {}

    async execute(input: CreateContestInputDTO): Promise<CreateContestOutputDTO> {
        const contest = new ContestEntity (
            input.title,
            input.description,
            input.type,
            input.gameIds??[],
            input.startDate,
            input.endDate,
            ContestStatus.ACTIVE,
            [],
            input.winnerCriteria,
            input.targetValue
        );
        const createdContest = await this._contestRepo.create( contest);
        const id = createdContest.getId()!;
        return {
            id,
            title: createdContest.getTitle(),
            description: createdContest.getDescription(),
            type: createdContest.getType(),
            gameIds: createdContest.getGameIds(),
            winnerCriteria: createdContest.getWinnerCriteria(),
            targetValue: createdContest.getTargetValue(),
            startDate: createdContest.getStartDate(),
            endDate: createdContest.getEndDate(),
            status: createdContest.getStatus(),
            winners: createdContest.getWinners(),
        };
    }
}