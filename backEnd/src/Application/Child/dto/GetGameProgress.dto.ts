
export interface GetGameProgressInputDTO {
    childId: string;
    gameId: string;
}

export interface GetGameProgressOutputDTO {
   
    levels: {
        levelId: string;
        stars: number;
        completed: boolean;
    }[];
}