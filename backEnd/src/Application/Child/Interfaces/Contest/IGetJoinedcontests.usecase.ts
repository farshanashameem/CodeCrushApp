import {
    GetJoinedContestsInputDTO,
    GetJoinedContestsOutputDTO,
} from '../../dto/Contest/GetJoinedContests.dto';

export interface IGetJoinedContestsUseCase {
    execute( request: GetJoinedContestsInputDTO ): Promise<GetJoinedContestsOutputDTO>;
}