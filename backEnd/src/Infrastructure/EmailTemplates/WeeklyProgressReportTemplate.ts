import { WeeklyProgressReportDTO } from "@/Application/Cron/dto/WeeklyProgressReport.dto";
const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hrs, mins, secs]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
};
export const WeeklyProgressReportTemplate = (
  report: WeeklyProgressReportDTO,
): string => {
  const childrenHtml = report.children
    .map((child) => {
      const hasWeeklyActivity = child.games.some(
        (game) => game.levelsPlayedThisWeek > 0,
      );

      const gamesHtml = child.games
        .map(
          (game) => `
            <div style="
                background:#f8fafc;
                border-left:5px solid #4f46e5;
                border-radius:12px;
                padding:18px;
                margin-top:16px;
            ">
                <h3 style="margin:0 0 12px;color:#4f46e5;">
                    🎮 ${game.gameName}
                </h3>

                <table width="100%" style="border-collapse:collapse;font-size:14px;">
                    <tr>
                        <td style="padding:6px 0;"><strong>🏆 Current Level</strong></td>
                        <td align="right">${game.currentLevel}</td>
                    </tr>

                    <tr>
                        <td style="padding:6px 0;">📚 Levels Played</td>
                        <td align="right">${game.levelsPlayedThisWeek}</td>
                    </tr>

                    <tr>
                        <td style="padding:6px 0;">✅ Levels Completed</td>
                        <td align="right">${game.levelsCompletedThisWeek}</td>
                    </tr>

                    <tr>
                        <td style="padding:6px 0;">⭐ Highest Score</td>
                        <td align="right">${game.highestScoreThisWeek}</td>
                    </tr>

                    <tr>
                        <td style="padding:6px 0;">⏱ Best Time</td>
                        <td align="right">${formatDuration(game.bestTimeThisWeek)}</td>
                    </tr>

                    <tr>
                        <td style="padding:6px 0;">🌟 Average Stars</td>
                        <td align="right">${game.averageStarsThisWeek}</td>
                    </tr>
                </table>
            </div>
        `,
        )
        .join("");

      return `
            <div style="
                background:#ffffff;
                border-radius:16px;
                padding:24px;
                margin-top:28px;
                border:1px solid #e5e7eb;
                box-shadow:0 4px 12px rgba(0,0,0,0.05);
            ">

                <h2 style="margin-top:0;color:#1f2937;">
                    👧 ${child.childName}
                </h2>

                <table width="100%" style="margin-bottom:20px;">
                    <tr>
                        <td>🎮 Total Games Played</td>
                        <td align="right"><strong>${child.totalGamesPlayed}</strong></td>
                    </tr>

                    <tr>
                        <td>⏳ Total Play Time</td>
                        <td align="right">
                            <strong>${formatDuration(child.totalPlayTime)}</strong>
                        </td>
                    </tr>

                    <tr>
                        <td>🕒 Last Played</td>
                        <td align="right">
                            ${
                              child.lastPlayed
                                ? child.lastPlayed.toLocaleDateString()
                                : "No activity"
                            }
                        </td>
                    </tr>
                </table>

               ${
                 hasWeeklyActivity
                   ? gamesHtml
                   : `
        <div style="
            margin-top:20px;
            padding:22px;
            background:#fff8e1;
            border-left:6px solid #f59e0b;
            border-radius:12px;
        ">
            <h3 style="
                margin-top:0;
                color:#b45309;
            ">
                📭 No Activity This Week
            </h3>

            <p style="
                color:#78350f;
                line-height:1.8;
                margin-bottom:0;
            ">
                <strong>${child.childName}</strong> did not play any CodeCrush games this week.

                <br><br>

                Encourage them to spend a little time learning through fun games next week.
                Even 15–20 minutes of play each day can help improve their skills and build
                a consistent learning habit. 🌟
            </p>
        </div>
        `
               }

            </div>
        `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Weekly Progress Report</title>
</head>

<body style="
    margin:0;
    background:#eef4ff;
    font-family:Arial,Helvetica,sans-serif;
">

<div style="
    max-width:760px;
    margin:40px auto;
    background:white;
    border-radius:18px;
    overflow:hidden;
    box-shadow:0 10px 30px rgba(0,0,0,.12);
">

    <div style="
        background:linear-gradient(135deg,#4f46e5,#06b6d4);
        color:white;
        padding:40px;
        text-align:center;
    ">
        <h1 style="margin:0;font-size:34px;">
            🎮 CodeCrush
        </h1>

        <p style="margin-top:12px;font-size:18px;">
            Weekly Progress Report
        </p>
    </div>

    <div style="padding:35px;">

        <h2 style="color:#111827;">
            Hello ${report.parentName}! 👋
        </h2>

        <p style="
            color:#4b5563;
            line-height:1.8;
            font-size:15px;
        ">
            Here's your children's learning progress for this week.
            Celebrate their achievements and encourage them to keep
            learning through fun games!
        </p>

        ${childrenHtml}

        <div style="
            margin-top:35px;
            padding:22px;
            background:#ecfeff;
            border-radius:12px;
            border-left:6px solid #06b6d4;
        ">
            💡 <strong>Tip:</strong><br><br>

            Celebrate every achievement—whether it's completing a level,
            improving a score, or simply spending time learning.
            Consistent practice helps children build confidence and
            develop problem-solving skills.
        </div>

    </div>

    <div style="
        background:#111827;
        color:#d1d5db;
        text-align:center;
        padding:24px;
        font-size:14px;
    ">

        <strong style="color:white;">
            Thank you for choosing CodeCrush ❤️
        </strong>

        <br><br>

        Keep learning. Keep playing. Keep growing. 🚀

    </div>

</div>

</body>
</html>
`;
};
