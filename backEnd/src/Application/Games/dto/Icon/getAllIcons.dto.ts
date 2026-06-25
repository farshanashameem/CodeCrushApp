import { IconDTO } from "./icon.dto";

export interface GetAllIconsInputDTO {}

export interface GetAllIconsOutputDTO {
    icons: IconDTO[];
}