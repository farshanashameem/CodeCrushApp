import { z } from 'zod';
import { ChatOpenAI } from '@langchain/openai';

import { IAIGameService } from '@/Application/Interfaces/Services/IAIGameService';
import { CreateAIGameInputDTO } from '@/Application/AIGame/dto/CreateAIGame.dto';
import {
    AIGameOutput,
    aiQuizOutputSchema,
    aiTypingOutputSchema,
    aiMemoryOutputSchema,
    aiSortingOutputSchema,
    aiCatchOutputSchema,
} from '@/Application/AIGame/validator/AIGameOutputValidator';
import { env } from '@/Infrastructure/Config/env';
import AIGameType from '@/Domain/enums/AIGameType.enum';

const testSchema = z.object({
    message: z.string(),
});

export class LangChainAIGameService implements IAIGameService {

    private readonly _model: ChatOpenAI;

    constructor() {
        this._model = new ChatOpenAI({
            apiKey: env.OPENAI_API_KEY,
            model: 'gpt-5.4-mini',
            temperature: 0.7,
        });
    }

    async generateGame(
        input: CreateAIGameInputDTO
    ): Promise<AIGameOutput> {

        let countInstruction = '';

        switch (input.gameType) {

        case AIGameType.QUIZ:
            countInstruction = `
        Generate exactly ${input.questionCount} questions.

        For every question:
        - Generate exactly 4 answer options.
        - There must be exactly ONE correct answer.
        - Determine the correct answer from the question content BEFORE creating the options.
        - Verify the correct answer independently before returning the question.
        - Set the correctAnswer/correct option only after verifying it.
        - Do NOT assume that the first option is correct.
        - Randomize the position of the correct answer across A, B, C, and D.
        - Across the entire quiz, distribute correct answers as evenly as possible among A, B, C, and D.
        - Do not use a predictable answer-position pattern.
        - The correct answer must not consistently appear in the first or second position.
        - All incorrect options must be plausible but factually incorrect.
        - Do not make the correct option noticeably longer, more detailed, or more specific than the incorrect options.
        - Before returning each question, verify that the selected correct option actually answers the question.

        IMPORTANT:
        The answer position must be independently randomized for every question.
        Never always place the correct answer at index 0 or index 1.
        `;
            break;

            case AIGameType.TYPING:
                countInstruction =
                    `Generate exactly ${input.wordCount} words.`;
                break;

            case AIGameType.MEMORY: {
                    const pairCount = input.pairCount;

                    if (pairCount === undefined) {
                        throw new Error('pairCount is required for MEMORY games');
                    }

                    countInstruction = `
                Generate exactly ${pairCount} matching pairs,
                which means exactly ${pairCount * 2} cards.

                Each pair must use the same numeric ID exactly twice.

                For example, if pairCount is 3:
                - ID 1 must appear exactly twice
                - ID 2 must appear exactly twice
                - ID 3 must appear exactly twice

                Do NOT give every card a unique ID.
                `;
                    break;
                }

            case AIGameType.SORTING:
                countInstruction =
                    `Generate exactly ${input.categoryCount} categories. Every category must contain at least one item.`;
                break;

            case AIGameType.CATCH:
                countInstruction = `
                    Generate exactly ${input.objectTypeCount} object types.

                    For each object, generate a "count" field indicating how many
                    times the child must catch that object to complete the game.

                    The count must be between 1 and 10.

                    Do not generate a "points" field.

                    The game is completed when the child catches the required count
                    of every object type.
                `;
                break;
        }

        const prompt = `
You are an educational game generator for CodeCrush,
an educational gaming platform for children aged 5 to 10.

Create a ${input.gameType} game.

Topic:
${input.prompt}

Difficulty:
${input.difficulty}

${countInstruction}

Rules:
- The game must be suitable for children aged 5 to 10.
- Use simple and age-appropriate language.
- Make the game fun and educational.
- Follow the requested game type exactly.
- Do not add information outside the required structured output.
`;

        let result: AIGameOutput;

        switch (input.gameType) {

            case AIGameType.QUIZ: {
                const structuredModel =
                    this._model.withStructuredOutput(aiQuizOutputSchema);

                result = await structuredModel.invoke(prompt);
                break;
            }

            case AIGameType.TYPING: {
                const structuredModel =
                    this._model.withStructuredOutput(aiTypingOutputSchema);

                result = await structuredModel.invoke(prompt);
                break;
            }

            case AIGameType.MEMORY: {
                const structuredModel =
                    this._model.withStructuredOutput(aiMemoryOutputSchema);

                result = await structuredModel.invoke(prompt);
                break;
            }

            case AIGameType.SORTING: {
                const structuredModel =
                    this._model.withStructuredOutput(aiSortingOutputSchema);

                result = await structuredModel.invoke(prompt);
                break;
            }

            case AIGameType.CATCH: {
                const structuredModel =
                    this._model.withStructuredOutput(aiCatchOutputSchema);

                result = await structuredModel.invoke(prompt);
                break;
            }
        }

        return result;
    }

    async testConnection(): Promise<string> {

        const structuredModel =
            this._model.withStructuredOutput(testSchema);

        const response = await structuredModel.invoke(
            'Return a short hello message for CodeCrush.'
        );

        return response.message;
    }
}