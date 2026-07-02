import { ColorSorterConfig, MouseTrackerConfig, PicturePuzzleConfig, TypingConfig } from '../../../../Domain/Types/Config';

export interface UpdateLevelInputDTO {

    levelId: string;
    levelNumber?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    timer?: number;
    maxScore?: number;
    config?: ColorSorterConfig | MouseTrackerConfig | PicturePuzzleConfig | TypingConfig;
    isActive?: boolean;   
}

export interface UpdateLevelOutputDTO {
    success: boolean;
    message: string;
}