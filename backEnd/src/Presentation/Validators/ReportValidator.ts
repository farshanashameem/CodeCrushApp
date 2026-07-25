import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const getReportSchema = z
  .object({
    range: z.enum(["today", "week", "month", "year", "custom"]),

    from: z.string().regex(dateRegex, "Invalid date format").optional(),

    to: z.string().regex(dateRegex, "Invalid date format").optional(),
    gameId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid game id")
        .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.range !== "custom") return;

    if (!data.from) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["from"],
        message: "From date is required.",
      });
    }

    if (!data.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to"],
        message: "To date is required.",
      });
    }

    if (data.from && data.to && new Date(data.from) > new Date(data.to)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["from"],
        message: "From date cannot be after To date.",
      });
    }
  });