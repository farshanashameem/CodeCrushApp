export interface ICleanupDeletedRecordsUseCase {
    execute(): Promise<void>;
}