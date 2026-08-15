export interface IFinalizeExpiredContestsUseCase {
    execute(): Promise<void>;
}