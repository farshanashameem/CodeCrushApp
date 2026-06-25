export interface IChangeStatusUseCase {
    execute(id): Promise<void>

}