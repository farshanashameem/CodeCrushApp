export interface IParentLogoutUseCase {
    execute( refreshToken: string ) : Promise<void>;
}