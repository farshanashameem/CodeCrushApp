import IconEntity from "@/Domain/Entities/Icon.entity";

export interface IGetIconUseCase {
    execute( id: string) : Promise<IconEntity | null>
}