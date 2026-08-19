import { z } from 'zod';
import AIGameDifficulty from '@/Domain/enums/AIGameDifficulty.enum';
import AIGameType from '@/Domain/enums/AIGameType.enum';

const aiGameDifficultySchema = z.enum(
  Object.values(AIGameDifficulty) as [AIGameDifficulty, ...AIGameDifficulty[]],
);

export const aiQuizOutputSchema = z
  .object({
    gameType: z.literal(AIGameType.QUIZ),

    title: z.string().trim().min(1).max(100),

    description: z.string().trim().min(1).max(300),

    theme: z.string().trim().min(1).max(100),

    difficulty: aiGameDifficultySchema,

    questionCount: z.number().int().min(5).max(15),

    questions: z
      .array(
        z.object({
          question: z.string().trim().min(1).max(300),

          options: z.array(z.string().trim().min(1).max(100)).length(4),

          correctAnswer: z.number().int().min(0).max(3),
        }),
      )
      .min(5)
      .max(15),

    timeLimit: z.number().int().positive(),
  })
  .superRefine((data, ctx) => {
    if (data.questions.length !== data.questionCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['questions'],
        message: `Expected ${data.questionCount} questions, but received ${data.questions.length}`,
      });
    }
  });

export const aiTypingOutputSchema = z
  .object({
    gameType: z.literal(AIGameType.TYPING),

    title: z.string().trim().min(1).max(100),

    description: z.string().trim().min(1).max(300),

    theme: z.string().trim().min(1).max(100),

    difficulty: aiGameDifficultySchema,

    wordCount: z.number().int().min(5).max(15),

    words: z.array(z.string().trim().min(1).max(30)).min(5).max(15),

    timeLimit: z.number().int().positive(),
  })
  .superRefine((data, ctx) => {
    if (data.words.length !== data.wordCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['words'],
        message: `Expected ${data.wordCount} words, but received ${data.words.length}`,
      });
    }
  });

export const aiMemoryOutputSchema = z
  .object({
    gameType: z.literal(AIGameType.MEMORY),

    title: z.string().trim().min(1).max(100),

    description: z.string().trim().min(1).max(300),

    theme: z.string().trim().min(1).max(100),

    difficulty: aiGameDifficultySchema,

    pairCount: z.number().int().min(4).max(10),

    cards: z
      .array(
        z.object({
          id: z.number().int().positive(),

          content: z.string().trim().min(1).max(100),
        }),
      )
      .min(8)
      .max(20),
  })
  .superRefine((data, ctx) => {
    // Rule 1: card count must match pair count
    if (data.cards.length !== data.pairCount * 2) {
      ctx.addIssue({
        code: 'custom',
        path: ['cards'],
        message: `Expected ${data.pairCount * 2} cards for ${data.pairCount} pairs, but received ${data.cards.length}`,
      });
    }

    // Rule 2: every pair ID must occur exactly twice
    const pairCounts = new Map<number, number>();

    for (const card of data.cards) {
      pairCounts.set(card.id, (pairCounts.get(card.id) ?? 0) + 1);
    }

    for (const [pairId, count] of pairCounts) {
      if (count !== 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['cards'],
          message: `Pair ID ${pairId} must appear exactly twice, but appeared ${count} times`,
        });
      }
    }

    // Rule 3: number of unique pair IDs must match pairCount
    if (pairCounts.size !== data.pairCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['cards'],
        message: `Expected ${data.pairCount} unique pair IDs, but received ${pairCounts.size}`,
      });
    }
  });

export const aiSortingOutputSchema = z
  .object({
    gameType: z.literal(AIGameType.SORTING),

    title: z.string().trim().min(1).max(100),

    description: z.string().trim().min(1).max(300),

    theme: z.string().trim().min(1).max(100),

    difficulty: aiGameDifficultySchema,

    categoryCount: z.number().int().min(2).max(4),

    categories: z.array(z.string().trim().min(1).max(50)).min(2).max(4),

    items: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(50),

          category: z.string().trim().min(1).max(50),
        }),
      )
      .min(4)
      .max(20),
  })
  .superRefine((data, ctx) => {
    // Rule 1: category count must match
    if (data.categories.length !== data.categoryCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['categories'],
        message: `Expected ${data.categoryCount} categories, but received ${data.categories.length}`,
      });
    }

    // Rule 2: every item's category must exist
    for (const item of data.items) {
      if (!data.categories.includes(item.category)) {
        ctx.addIssue({
          code: 'custom',
          path: ['items'],
          message: `Item "${item.name}" has invalid category "${item.category}"`,
        });
      }
    }

    // Rule 3: every category must have at least one item
    for (const category of data.categories) {
      const hasItem = data.items.some((item) => item.category === category);

      if (!hasItem) {
        ctx.addIssue({
          code: 'custom',
          path: ['items'],
          message: `Category "${category}" must have at least one item`,
        });
      }
    }
  });

export const aiCatchOutputSchema = z
  .object({
    gameType: z.literal(AIGameType.CATCH),

    title: z.string().trim().min(1).max(100),

    description: z.string().trim().min(1).max(300),

    theme: z.string().trim().min(1).max(100),

    difficulty: aiGameDifficultySchema,

    objectTypeCount: z.number().int().min(1).max(5),

    objects: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(50),

          emoji: z.string().trim().min(1).max(10),

          count: z.number().int().min(1).max(10),
        }),
      )
      .min(1)
      .max(5),

    duration: z.number().int().min(30).max(120),
  })
  .superRefine((data, ctx) => {
    if (data.objects.length !== data.objectTypeCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['objects'],
        message: `Expected ${data.objectTypeCount} object types, but received ${data.objects.length}`,
      });
    }
  });

export const aiGameOutputSchema = z.discriminatedUnion('gameType', [
  aiQuizOutputSchema,
  aiTypingOutputSchema,
  aiMemoryOutputSchema,
  aiSortingOutputSchema,
  aiCatchOutputSchema,
]);

export type AIGameOutput = z.infer<typeof aiGameOutputSchema>;
