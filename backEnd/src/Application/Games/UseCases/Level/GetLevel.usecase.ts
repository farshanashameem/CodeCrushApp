import { ILevelRepository } from '@/Domain/RepositoryInterface/ILevel.repository';
import { IGetLevelUseCase } from '../../Interfaces/Level/IGetLevel.usecase';
import {
  GetLevelInputDTO,
  GetLevelOutputDTO,
} from '../../dto/Level/GetLevel.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { IImageRepository } from '@/Domain/RepositoryInterface/IImage.repository';
import { ColorSorterConfig, LevelConfigResponse } from '@/Domain/Types/Config';
import { IIconRepository } from '@/Domain/RepositoryInterface/IIcon.repository';

export class GetLevelUseCase implements IGetLevelUseCase {
  constructor(
    private _levelRepo: ILevelRepository,
    private _imageRepo: IImageRepository,
    private _iconRepo: IIconRepository
  ) {}

  async execute(input: GetLevelInputDTO): Promise<GetLevelOutputDTO> {
    const level = await this._levelRepo.findById(input.levelId);

    if (!level) {
      throw new AppError(
        authMessages.error.LEVEL_NOT_FOUND,
        StatusCodes.NOT_FOUND,
      );
    }

    let config: LevelConfigResponse = level.getConfig() as LevelConfigResponse;
    if ('steps' in config) {
      const steps = await Promise.all(
        config.steps.map(async (step) => {
          const image = await this._imageRepo.findById(step.imageId);

          return {
            imageId: step.imageId,
            imageName: image?.getName() ?? '',
            imageUrl: image?.getImageUrl() ?? '',
            answer: step.answer,
          };
        }),
      );

      config = { steps };
    }

    const colorConfig = config as ColorSorterConfig;
    if ('items' in config && 'targetColors' in config) {
    const items = await Promise.all(
        colorConfig.items.map(async (item) => {
            const icon = await this._iconRepo.findById(item.iconId);

            return {
                iconId: item.iconId,
                iconKey: icon?.getIconKey() ?? '',
                color: item.color,
                count: item.count,
            };
        })
    );

    config = {
        targetColors: config.targetColors,
        items,
    };
}
    return {
      id: level.getId()!,
      gameId: level.getGameId(),
      levelNumber: level.getLevelNumber(),
      difficulty: level.getDifficulty(),
      timer: level.getTimer(),
      maxScore: level.getMaxScore(),
      config,
      isActive: level.isLevelActive(),
    };
  }
}
