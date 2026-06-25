export interface ColorSorterItemForm {
  iconId: string;
  iconName: string;
  iconKey: string;

  category?: string;

  color: string;
  count: number;
}

export interface CreateColorSorterLevelPayload {
  gameId: string;

  levelNumber: number;

  difficulty: "easy" | "medium" | "hard";

  timer: number;

  maxScore: number;

  config: {
    targetColors: string[];

    items: {
      iconId: string;
      color: string;
      count: number;
    }[];
  };
}