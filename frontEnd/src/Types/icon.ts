export interface Icon {
  id: string;
  name: string;
  iconKey: string;
  color: string,
  category?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const ICON_CATEGORIES = [
  "Animals",
  "Birds",
  "SeaAnimals",
  "Nature",
  "Fruits",
  "Vegetables",
  "Food",
  "Sports",
  "Toys",
  "Vehicles",
  "Objects",
  "ColorsAndShapes",
  "Flags",
] as const;