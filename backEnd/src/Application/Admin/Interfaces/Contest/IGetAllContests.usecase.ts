import {  GetAllContestsOutputDTO } from '../../dto/Contest/GetAllContests.dto';

export interface IGetAllContestsUseCase {
    execute(  ): Promise<GetAllContestsOutputDTO[]>;
}