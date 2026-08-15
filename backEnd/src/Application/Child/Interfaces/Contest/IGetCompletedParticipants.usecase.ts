import {
    GetCompletedParticipantsInputDTO,
    GetCompletedParticipantsOutputDTO,
} from '../../dto/Contest/GetCompletedParticipants.dto';

export interface IGetCompletedParticipantsUseCase {
    execute( request: GetCompletedParticipantsInputDTO ): Promise<GetCompletedParticipantsOutputDTO>;
}