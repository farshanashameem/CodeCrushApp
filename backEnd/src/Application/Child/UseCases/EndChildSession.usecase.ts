import { IChildSessionRepository } from '@/Domain/RepositoryInterface/IChildSession.repository';
import { IEndChildSessionUseCase } from '../Interfaces/IEndChildSession.usecase';
import { EndChildSessionInputDTO } from '../dto/EndChildSession.dto';

export class EndChildSessionUseCase implements IEndChildSessionUseCase {
    constructor(
        private _childSessionrepo: IChildSessionRepository
    ) {}

    async execute(input: EndChildSessionInputDTO): Promise<void> {
        await this._childSessionrepo.deactivate( input.sessionId);
    }
}