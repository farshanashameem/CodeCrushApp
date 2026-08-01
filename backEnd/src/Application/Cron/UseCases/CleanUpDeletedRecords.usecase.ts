import { IParentRepository } from "@/Domain/RepositoryInterface/IParent.repository";
import { IChildRepository } from "@/Domain/RepositoryInterface/IChild.repository";
import { ICleanupDeletedRecordsUseCase } from "../Interfaces/ICleanupDeletedRecods.usecase";

export class CleanupDeletedRecordsUseCase implements ICleanupDeletedRecordsUseCase
{
    constructor(
        private readonly _parentRepo: IParentRepository,
        private readonly _childRepo: IChildRepository
    ) {}

    async execute(): Promise<void> {
        await this._parentRepo.cleanupDeleted();
        await this._childRepo.cleanupDeleted();
        await this._parentRepo.cleanupExpiredPremiumSubscriptions();
    }
}