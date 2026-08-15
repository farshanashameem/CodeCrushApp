import { IContestProgressRepository } from '@/Domain/RepositoryInterface/IContestProgress.repository';
import { IGetCompletedParticipantsUseCase } from '../../Interfaces/Contest/IGetCompletedParticipants.usecase';
import { GetCompletedParticipantsInputDTO, GetCompletedParticipantsOutputDTO } from '../../dto/Contest/GetCompletedParticipants.dto';

export class GetCompletedParticipantsUseCase implements IGetCompletedParticipantsUseCase{
    constructor (
        private _contestProgressRepo: IContestProgressRepository
    ) {} 

    async execute(request: GetCompletedParticipantsInputDTO): Promise<GetCompletedParticipantsOutputDTO> {
        const participants = await this._contestProgressRepo.getCompletedParticipants( request.contestId);
        return {
            participants: participants.map((participant) => ({
                childId: participant.getChildId(),
                score: participant.getStats().score,
                stars: participant.getStats().stars,
                levelsCompleted: participant.getStats().levelsCompleted,
                joinedAt: participant.getJoinedAt(),
            })),
        };
    }
}