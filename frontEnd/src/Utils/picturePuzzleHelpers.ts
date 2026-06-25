import type { PicturePuzzleStepForm } from "../Types/level";

// =========================
// SCORE CALCULATION
// =========================

export const calculatePuzzleScore = (
  totalImages: number
): number => {
  return totalImages * 10;
};

// =========================
// MOVE STEP UP
// =========================

export const moveStepUp = (
  steps: PicturePuzzleStepForm[],
  index: number
): PicturePuzzleStepForm[] => {

  if (index <= 0) return steps;

  const updated = [...steps];

  [updated[index - 1], updated[index]] = [
    updated[index],
    updated[index - 1],
  ];

  return updated;
};

// =========================
// MOVE STEP DOWN
// =========================

export const moveStepDown = (
  steps: PicturePuzzleStepForm[],
  index: number
): PicturePuzzleStepForm[] => {

  if (index >= steps.length - 1) {
    return steps;
  }

  const updated = [...steps];

  [updated[index], updated[index + 1]] = [
    updated[index + 1],
    updated[index],
  ];

  return updated;
};

// =========================
// DELETE STEP
// =========================

export const removeStep = (
  steps: PicturePuzzleStepForm[],
  index: number
): PicturePuzzleStepForm[] => {

  return steps.filter(
    (_, i) => i !== index
  );
};

// =========================
// UPDATE ANSWER
// =========================

export const updateStepAnswer = (
  steps: PicturePuzzleStepForm[],
  index: number,
  answer: string
): PicturePuzzleStepForm[] => {

  return steps.map((step, i) =>
    i === index
      ? {
          ...step,
          answer,
        }
      : step
  );
};

// =========================
// PREVENT DUPLICATES
// =========================

export const imageAlreadySelected = (
  steps: PicturePuzzleStepForm[],
  imageId: string
): boolean => {

  return steps.some(
    (step) => step.imageId === imageId
  );
};