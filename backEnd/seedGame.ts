import { connectDB } from './src/Infrastructure/Config/mongo.config';
import { GameModel } from './src/Infrastructure/Database/Model/GameModel';

async function seedGames() {
  try {
    await connectDB();

    const existingGames = await GameModel.countDocuments();

    if (existingGames > 0) {
      console.log('Games already seeded');
      process.exit(0);
    }

    await GameModel.insertMany([
      {
        name: 'Mouse Trackers',
        image: 'MouseTrackers.png',
        description:
          'Move the cursor through the path and reach the target without touching the boundaries.',
        skillType: 'Fine Motor Skills',
      },
      {
        name: 'Colour Sorter Safari',
        image: 'ColourSorterSafari.png',
        description:
          'Drag the colored object matching the colour on the screen to the box before time runs out.',
        skillType: 'Color Recognition',
      },
      {
        name: 'Picture Puzzlers',
        image: 'PicturePuzzlers.png',
        description:
          'Look at the picture and type the correct name of the object shown.',
        skillType: 'Object Recognition',
      },
      {
        name: 'Typing Titans',
        image: 'TypingTitans.png',
        description:
          'Type the displayed word accurately before the timer ends.',
        skillType: 'Typing Skills',
      },
    ]);

    console.log('Games seeded successfully');
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedGames();