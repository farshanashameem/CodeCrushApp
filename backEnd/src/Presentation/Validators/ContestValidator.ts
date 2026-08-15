import z from 'zod';

import ContestType from '@/Domain/enums/ContestType.enum';
import WinnerCriteria from '@/Domain/enums/WinnerCriteria.enum';
import ContestStatus from '@/Domain/enums/ContestStatus.enum';

/**
 * Schema for creating a contest
 */
export const createContestSchema = z
    .object({
        // ==========================================================
        // TITLE
        // ==========================================================

        title: z
            .string()
            .trim()
            .min(2, 'Title must be at least 2 characters')
            .max(100, 'Title must be at most 100 characters'),

        // ==========================================================
        // DESCRIPTION
        // ==========================================================

        description: z
            .string()
            .trim()
            .min(5, 'Description must be at least 5 characters')
            .max(500, 'Description must be at most 500 characters'),

        // ==========================================================
        // CONTEST TYPE
        // ==========================================================

        type: z.nativeEnum(ContestType),

        // ==========================================================
        // GAMES
        // ==========================================================

        gameIds: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, 'Game ID cannot be empty')
            )
            .optional(),

        // ==========================================================
        // WINNER CRITERIA
        // ==========================================================

        winnerCriteria: z.nativeEnum(WinnerCriteria),

        // ==========================================================
        // TARGET VALUE
        //
        // Optional at the base level because:
        // - PARTICIPATION -> required
        // - CHALLENGE -> not allowed
        // ==========================================================

        targetValue: z
            .number()
            .positive('Target value must be greater than 0')
            .optional(),

        // ==========================================================
        // DATES
        // ==========================================================

        startDate: z.coerce.date(),

        endDate: z.coerce.date(),
    })

    // ==============================================================
    // DATE VALIDATION
    // ==============================================================

    .refine(
        (data) => data.endDate > data.startDate,
        {
            message: 'End date must be after start date',
            path: ['endDate'],
        }
    )

    // ==============================================================
    // TARGET VALUE VALIDATION
    // ==============================================================

    .superRefine((data, ctx) => {

        // ----------------------------------------------------------
        // PARTICIPATION
        // Target value is REQUIRED
        // ----------------------------------------------------------

        if (data.type === ContestType.PARTICIPATION) {

            if (data.targetValue === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['targetValue'],
                    message:
                        'Target value is required for participation contests',
                });
            }
        }

        // ----------------------------------------------------------
        // CHALLENGE
        // Target value is NOT allowed
        // ----------------------------------------------------------

        if (data.type === ContestType.CHALLENGE) {

            if (data.targetValue !== undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['targetValue'],
                    message:
                        'Target value is not allowed for challenge contests',
                });
            }
        }
    });


/**
 * Schema for updating a contest
 */
export const updateContestSchema = z
    .object({
        // ==========================================================
        // TITLE
        // ==========================================================

        title: z
            .string()
            .trim()
            .min(2, 'Title must be at least 2 characters')
            .max(100, 'Title must be at most 100 characters'),

        // ==========================================================
        // DESCRIPTION
        // ==========================================================

        description: z
            .string()
            .trim()
            .min(5, 'Description must be at least 5 characters')
            .max(500, 'Description must be at most 500 characters'),

        // ==========================================================
        // CONTEST TYPE
        // ==========================================================

        type: z.nativeEnum(ContestType),

        // ==========================================================
        // GAMES
        // ==========================================================

        gameIds: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, 'Game ID cannot be empty')
            )
            .optional(),

        // ==========================================================
        // WINNER CRITERIA
        // ==========================================================

        winnerCriteria: z
            .nativeEnum(WinnerCriteria)
            .optional(),

        // ==========================================================
        // TARGET VALUE
        // ==========================================================

        targetValue: z
            .number()
            .positive('Target value must be greater than 0')
            .optional(),

        // ==========================================================
        // DATES
        // ==========================================================

        startDate: z.coerce.date(),

        endDate: z.coerce.date(),
    })

    // ==============================================================
    // DATE VALIDATION
    // ==============================================================

    .refine(
        (data) => data.endDate > data.startDate,
        {
            message: 'End date must be after start date',
            path: ['endDate'],
        }
    )

    // ==============================================================
    // TARGET VALUE VALIDATION
    // ==============================================================

    .superRefine((data, ctx) => {

        // ----------------------------------------------------------
        // PARTICIPATION
        // Target value is REQUIRED
        // ----------------------------------------------------------

        if (data.type === ContestType.PARTICIPATION) {

            if (data.targetValue === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['targetValue'],
                    message:
                        'Target value is required for participation contests',
                });
            }
        }

        // ----------------------------------------------------------
        // CHALLENGE
        // Target value is NOT allowed
        // ----------------------------------------------------------

        if (data.type === ContestType.CHALLENGE) {

            if (data.targetValue !== undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['targetValue'],
                    message:
                        'Target value is not allowed for challenge contests',
                });
            }
        }
    });


/**
 * Schema for getting all contests
 */
export const getAllContestsSchema = z.object({
    status: z
        .nativeEnum(ContestStatus)
        .optional(),
});


/**
 * Schema for contest ID
 */
export const contestIdSchema = z.object({
    contestId: z
        .string()
        .trim()
        .min(1, 'Contest ID is required'),
});