import {
    CreateContestInputDTO,
    CreateContestOutputDTO,
} from '../../dto/Contest/createContest.dto';

export  interface ICreateContestUseCase {
    execute(
        input: CreateContestInputDTO
    ): Promise<CreateContestOutputDTO>;
}