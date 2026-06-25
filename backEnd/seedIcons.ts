import { connectDB } from "./src/Infrastructure/Config/mongo.config";
import { IconModel } from "./src/Infrastructure/Database/Model/IconModel";

export const CATEGORY_ITEMS = {
  Animals: [
    { name: "Frog", iconKey: "🐸", color: "green" },
    { name: "Pig", iconKey: "🐷", color: "pink" },
    { name: "Fox", iconKey: "🦊", color: "orange" },
    { name: "Bear", iconKey: "🐻", color: "brown" },
    { name: "Lion", iconKey: "🦁", color: "yellow" },
    { name: "Lizard", iconKey: "🦎", color: "green" },
    { name: "Caterpillar", iconKey: "🐛", color: "green" },
    { name: "Dinosaur", iconKey: "🦕", color: "green" },
    { name: "Cockroach", iconKey: "🪳", color: "brown" },
    { name: "Zebra", iconKey: "🦓", color: "black" },
    { name: "Deer", iconKey: "🦌", color: "brown" },
    { name: "Poodle", iconKey: "🐩", color: "grey" },
    { name: "Cat", iconKey: "🐈", color: "yellow" },
    { name: "Dragon Face", iconKey: "🐲", color: "green" },
    { name: "Dragon", iconKey: "🐉", color: "green" },
    { name: "Moose", iconKey: "🫎", color: "brown" },
    { name: "Ladybug", iconKey: "🐞", color: "red" },
    { name: "Bee", iconKey: "🐝", color: "yellow" },
    { name: "Butterfly", iconKey: "🦋", color: "orange" },
    { name: "Turtle", iconKey: "🐢", color: "green" },
    { name: "T-Rex", iconKey: "🦖", color: "green" }
  ],

  Birds: [
    { name: "Chick", iconKey: "🐤", color: "yellow" },
    { name: "Black Bird", iconKey: "🐦‍⬛", color: "black" },
    { name: "Chicken", iconKey: "🐓", color: "red" },
    { name: "Flamingo", iconKey: "🦩", color: "pink" },
    { name: "Peacock", iconKey: "🦚", color: "blue" },
    { name: "Goose", iconKey: "🪿", color: "brown" }
  ],

  SeaAnimals: [
    { name: "Crab", iconKey: "🦀", color: "red" },
    { name: "Tropical Fish", iconKey: "🐠", color: "blue" },
    { name: "Jellyfish", iconKey: "🪼", color: "blue" },
    { name: "Fish", iconKey: "🐟", color: "blue" },
    { name: "Whale", iconKey: "🐋", color: "blue" },
    { name: "Squid", iconKey: "🦑", color: "purple" },
    { name: "Coral", iconKey: "🪸", color: "orange" },
    { name: "Dolphin", iconKey: "🐬", color: "blue" },
    { name: "Shark", iconKey: "🦈", color: "grey" }
  ],

  Nature: [
    { name: "Tree", iconKey: "🌳", color: "green" },
    { name: "Pine Tree", iconKey: "🌲", color: "green" },
    { name: "Palm Tree", iconKey: "🌴", color: "green" },
    { name: "Seedling", iconKey: "🌱", color: "green" },
    { name: "Herb", iconKey: "🌿", color: "green" },
    { name: "Shamrock", iconKey: "☘️", color: "green" },
    { name: "Four Leaf Clover", iconKey: "🍀", color: "green" },
    { name: "Rose", iconKey: "🌹", color: "red" },
    { name: "Cherry Blossom", iconKey: "🌸", color: "pink" },
    { name: "Maple Leaf", iconKey: "🍁", color: "pink" },
    { name: "Sun", iconKey: "🌞", color: "yellow" },
    { name: "Flower", iconKey: "🌼", color: "white" },
    { name: "Rock", iconKey: "🪨", color: "grey" },

    { name: "Sunflower", iconKey: "🌻", color: "yellow" },
    { name: "Rainbow", iconKey: "🌈", color: "rainbow" },
    { name: "Star", iconKey: "⭐", color: "yellow" }
  ],

  Fruits: [
    { name: "Green Apple", iconKey: "🍏", color: "green" },
    { name: "Red Apple", iconKey: "🍎", color: "red" },
    { name: "Pear", iconKey: "🍐", color: "green" },
    { name: "Lemon", iconKey: "🍋", color: "yellow" },
    { name: "Orange", iconKey: "🍊", color: "orange" },
    { name: "Lime", iconKey: "🍋‍🟩", color: "green" },
    { name: "Banana", iconKey: "🍌", color: "yellow" },
    { name: "Watermelon", iconKey: "🍉", color: "red" },
    { name: "Grapes", iconKey: "🍇", color: "purple" },
    { name: "Strawberry", iconKey: "🍓", color: "red" },
    { name: "Blueberry", iconKey: "🫐", color: "blue" },
    { name: "Cherry", iconKey: "🍒", color: "red" },
     { name: "Kiwi", iconKey: "🥝", color: "green" }
  ],

  Vegetables: [
    { name: "Eggplant", iconKey: "🍆", color: "purple" },
    { name: "Peas", iconKey: "🫛", color: "green" },
    { name: "Broccoli", iconKey: "🥦", color: "green" },
    { name: "Leafy Green", iconKey: "🥬", color: "green" },
    { name: "Chili", iconKey: "🌶️", color: "red" },
    { name: "Bell Pepper", iconKey: "🫑", color: "green" },
    { name: "Carrot", iconKey: "🥕", color: "orange" },
    { name: "Garlic", iconKey: "🧄", color: "white" },
    { name: "Radish", iconKey: "🫜", color: "red" },
    { name: "Cucumber", iconKey: "🥒", color: "green" }
  ],

  Food: [
    { name: "Lollipop", iconKey: "🍭", color: "rainbow" },
    { name: "Moon Cake", iconKey: "🥮", color: "brown" },
    { name: "Cheese", iconKey: "🧀", color: "yellow" }
  ],

  Sports: [
    { name: "Basketball", iconKey: "🏀", color: "orange" },
    { name: "Baseball", iconKey: "⚾", color: "white" },
    { name: "Softball", iconKey: "🥎", color: "yellow" },
    { name: "Volleyball", iconKey: "🏐", color: "white" },
    { name: "Flying Disc", iconKey: "🥏", color: "blue" },
    { name: "Yoyo", iconKey: "🪀", color: "purple" },
    { name: "Ping Pong", iconKey: "🏓", color: "pink" },
    { name: "Jersey", iconKey: "🎽", color: "green" },
    { name: "Karate Uniform", iconKey: "🥋", color: "white" },
    { name: "Goal Net", iconKey: "🫟", color: "purple" }
  ],

  Toys: [
    { name: "Puzzle", iconKey: "🧩", color: "green" },
    { name: "Balloon", iconKey: "🎈", color: "red" },
    { name: "Ribbon", iconKey: "🎀", color: "red" }
  ],

  Vehicles: [
    { name: "Car", iconKey: "🚗", color: "red" },
    { name: "Taxi", iconKey: "🚕", color: "yellow" },
    { name: "SUV", iconKey: "🚙", color: "blue" },
    { name: "Bus", iconKey: "🚌", color: "yellow" },
    { name: "Pickup", iconKey: "🛻", color: "red" },
    { name: "Van", iconKey: "🚐", color: "white" },
    { name: "Scooter", iconKey: "🛵", color: "red" },
    { name: "Police Car", iconKey: "🚔", color: "blue" },
    { name: "Police Light", iconKey: "🚨", color: "red" },
    { name: "Trolleybus", iconKey: "🚍", color: "yellow" },
    { name: "Car Front", iconKey: "🚘", color: "blue" },
    { name: "Taxi Front", iconKey: "🚖", color: "yellow" },
    { name: "Train", iconKey: "🚃", color: "yellow" },
    { name: "Monorail", iconKey: "🚝", color: "blue" },
    { name: "Helicopter", iconKey: "🚁", color: "orange" }
  ],

  Objects: [
    { name: "Light Bulb", iconKey: "💡", color: "yellow" },
    { name: "Crystal Ball", iconKey: "🔮", color: "black" },
    { name: "Bomb", iconKey: "💣", color: "black" },
    { name: "Blood Drop", iconKey: "🩸", color: "pink" },
    { name: "Virus", iconKey: "🦠", color: "green" },
    { name: "Bucket", iconKey: "🪣", color: "blue" },
    { name: "Sponge", iconKey: "🧽", color: "yellow" },
    { name: "Comb", iconKey: "🪮", color: "brown" },
    { name: "Blue Book", iconKey: "📘", color: "blue" },
    { name: "Red Book", iconKey: "📕", color: "red" },
    { name: "Notebook", iconKey: "📔", color: "yellow" },
    { name: "Ledger", iconKey: "📒", color: "yellow" },
    { name: "Pin", iconKey: "📍", color: "red" },
  ],

  ColorsAndShapes: [
    { name: "Red Heart", iconKey: "❤️", color: "red" },
    { name: "Pink Heart", iconKey: "🩷", color: "pink" },
    { name: "Orange Heart", iconKey: "🧡", color: "orange" },
    { name: "Yellow Heart", iconKey: "💛", color: "yellow" },
    { name: "Green Heart", iconKey: "💚", color: "green" },
    { name: "Light Blue Heart", iconKey: "🩵", color: "blue" },
    { name: "Blue Heart", iconKey: "💙", color: "blue" },
    { name: "Purple Heart", iconKey: "💜", color: "purple" },
    { name: "Black Heart", iconKey: "🖤", color: "black" },
    { name: "White Heart", iconKey: "🤍", color: "white" },
    { name: "Brown Heart", iconKey: "🤎", color: "brown" },

    { name: "Red Circle", iconKey: "🔴", color: "red" },
    { name: "Orange Circle", iconKey: "🟠", color: "orange" },
    { name: "Yellow Circle", iconKey: "🟡", color: "yellow" },
    { name: "Green Circle", iconKey: "🟢", color: "green" },
    { name: "Blue Circle", iconKey: "🔵", color: "blue" },
    { name: "Purple Circle", iconKey: "🟣", color: "purple" },

    { name: "Red Square", iconKey: "🟥", color: "red" },
    { name: "Orange Square", iconKey: "🟧", color: "orange" },
    { name: "Yellow Square", iconKey: "🟨", color: "yellow" },
    { name: "Green Square", iconKey: "🟩", color: "green" },
    { name: "Blue Square", iconKey: "🟦", color: "blue" },
    { name: "Purple Square", iconKey: "🟪", color: "purple" },

    { name: "Red Triangle", iconKey: "🔺", color: "red" }
  ],

  Flags: [
    { name: "White Flag", iconKey: "🏳️", color: "white" },
    { name: "Black Flag", iconKey: "🏴", color: "black" },
    { name: "Red Flag", iconKey: "🚩", color: "red" }
  ]
} as const;

async function seedIcons() {
  try {
    await connectDB();

    const existingIcons =
      await IconModel.countDocuments();

    if (existingIcons > 0) {
      console.log("Icons already seeded");
      process.exit(0);
    }

    const icons = Object.entries(
      CATEGORY_ITEMS
    ).flatMap(([category, items]) =>
      items.map((item) => ({
        name: item.name,
        iconKey: item.iconKey,
        color: item.color,
        category,
      }))
    );

    await IconModel.insertMany(icons);

    console.log(
      `${icons.length} icons seeded successfully`
    );

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedIcons();