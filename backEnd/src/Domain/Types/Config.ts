export interface MouseTrackerConfig {
    pathWidth: number;

    pathCoordinates: {
        x: number;
        y: number;
    }[];
}

export interface ColorSorterConfig {
    targetColors: string[];

    items: {
        iconId: string;
        color: string;
        count: number;
    }[];
}

export interface TypingConfig {
    words: string[];
}

export interface PicturePuzzleStep {
    imageId: string;  
    answer: string;   
}

export interface PicturePuzzleConfig {
    steps: PicturePuzzleStep[]; 
}

export interface PicturePuzzleStepResponse {
    imageId: string;
    imageName: string;
    imageUrl: string;
    answer: string;
}
export interface PicturePuzzleConfigResponse {
    steps: PicturePuzzleStepResponse[];
}


export interface ColorSorterConfigResponse {
    targetColors: string[];

    items: {
        iconId: string;
        iconKey: string;
        color: string;
        count: number;
    }[];
}

export type LevelConfig =

    | MouseTrackerConfig
    | ColorSorterConfig
    | TypingConfig
    | PicturePuzzleConfig;

export type LevelConfigResponse =
    | MouseTrackerConfig
    | ColorSorterConfig
    |ColorSorterConfigResponse
    | TypingConfig
    | PicturePuzzleConfigResponse;