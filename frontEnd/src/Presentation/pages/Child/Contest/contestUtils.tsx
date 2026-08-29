export interface ContestPlayerStats {
  score?: number;
  stars?: number;
  levelsCompleted?: number;
}

export interface ContestPlayer {
  score?: number;
  stars?: number;
  levelsCompleted?: number;
  stats?: ContestPlayerStats;
}

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getRankEmoji = (rank: number): string => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";

  return `#${rank}`;
};

export const getWinnerCriteriaLabel = (
  criteria?: string,
): string => {
  switch (String(criteria ?? "").toUpperCase()) {
    case "SCORE":
      return "Score";

    case "STARS":
      return "Stars";

    case "LEVELS":
      return "Levels";

    default:
      return "Score";
  }
};

export const getWinnerCriteriaIcon = (
  criteria?: string,
): string => {
  switch (String(criteria ?? "").toUpperCase()) {
    case "SCORE":
      return "🏆";

    case "STARS":
      return "⭐";

    case "LEVELS":
      return "🎯";

    default:
      return "🏆";
  }
};

export const getCriteriaValue = (
  player: ContestPlayer,
  criteria?: string,
): number => {
  switch (String(criteria ?? "").toUpperCase()) {
    case "SCORE":
      return Number(
        player.score ??
          player.stats?.score ??
          0,
      );

    case "STARS":
      return Number(
        player.stars ??
          player.stats?.stars ??
          0,
      );

    case "LEVELS":
      return Number(
        player.levelsCompleted ??
          player.stats?.levelsCompleted ??
          0,
      );

    default:
      return 0;
  }
};