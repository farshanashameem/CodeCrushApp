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
                countInstruction =
                    `Generate exactly ${input.questionCount} questions.`;
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