import ParentEntity from "@/Domain/Entities/Parent.entity";
import { updateProfileDTO } from "../dto/update_profile.dto";

export interface IUpdateProfileUseCase {
    execute( data: updateProfileDTO) : Promise<ParentEntity>
}