import { ToggleUserStatusInputDTO, ToggleUserStatusOutputDTO } from "../dto/UserStatus.dto";

export interface IToggleUserStatusUseCase {
    execute( input: ToggleUserStatusInputDTO) : Promise<ToggleUserStatusOutputDTO>;
}