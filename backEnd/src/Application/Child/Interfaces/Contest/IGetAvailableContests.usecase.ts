import {
    GetAvailableContestsInputDTO,
    GetAvailableContestsOutputDTO,
} from '../../dto/Contest/GetAvailableContests.dto';

export interface IGetAvailableContestsUseCase {
    execute( request: GetAvailableContestsInputDTO ): Promise<GetAvailableContestsOutputDTO>;
}