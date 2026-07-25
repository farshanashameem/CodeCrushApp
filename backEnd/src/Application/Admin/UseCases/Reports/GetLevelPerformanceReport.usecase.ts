import { GetLevelProgressInputDTO, GetLevelProgressOutputDTO } from "@/Application/Child/dto/GetLevelProgressInfo.dto";
import { IGetLevelProgressInfoUseCase } from "@/Application/Child/Interfaces/IGetLevelProgress.usecase";
import { buildReportFilter } from "@/Application/Helpers/reportFilter.helper";
import { ILevelRepository } from "@/Domain/RepositoryInterface/ILevel.repository";
import { IGetLevelPerformanceReportUseCase } from "../../Interfaces/Report/IGetLevelPerformanceReport.usecase";
import { LevelPerformanceReportData } from "@/Domain/Types/LevelReport";
import { LevelPerformanceDTO } from "../../dto/levelPerformanceReport.dto";

export class GetLevelPerformanceReportUseCase implements IGetLevelPerformanceReportUseCase {
    constructor (
        private _levelRepo: ILevelRepository
    ) {}

    async execute(input: LevelPerformanceDTO): Promise<LevelPerformanceReportData> {
        const filter = buildReportFilter( input);
        return await this._levelRepo.getLevelPerformanceReport( filter, input.gameId );
    }
}