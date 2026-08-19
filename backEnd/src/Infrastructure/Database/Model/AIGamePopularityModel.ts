import mongoose, {
    Document,
    Schema,
    Model,
} from 'mongoose';

import AIGameType from '@/Domain/enums/AIGameType.enum';
import AIGameDifficulty from '@/Domain/enums/AIGameDifficulty.enum';

export interface IAIGamePopularity extends Document {
    _id: mongoose.Types.ObjectId;
    gameType: AIGameType;
    difficulty: AIGameDifficulty;
    creationCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const AIGamePopularitySchema: Schema<IAIGamePopularity> =
    new Schema(
        {
            gameType: {
                type: String,
                enum: Object.values(AIGameType),
                required: true,
            },

            difficulty: {
                type: String,
                enum: Object.values(AIGameDifficulty),
                required: true,
            },

            creationCount: {
                type: Number,
                default: 0,
                min: 0,
            },
        },
        {
            timestamps: true,
        },
    );

AIGamePopularitySchema.index(
    {
        gameType: 1,
        difficulty: 1,
    },
    {
        unique: true,
    },
);

export const AIGamePopularityModel: Model<IAIGamePopularity> =
    mongoose.model<IAIGamePopularity>(
        'AIGamePopularity',
        AIGamePopularitySchema,
    );