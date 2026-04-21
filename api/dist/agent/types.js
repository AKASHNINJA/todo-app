import { z } from "zod";
export const parseInputSchema = z.object({
    text: z.string().min(1),
    timezone: z.string().default("UTC"),
});
export const vibeTagSchema = z.enum(["grind", "chill", "errand", "deep", "someday", "ugh"]);
export const parsedTaskSchema = z.object({
    title: z.string().min(1),
    dueAt: z.string().datetime().nullable(),
    remindAt: z.string().datetime().nullable(),
    vibeTags: z.array(vibeTagSchema).default([]),
    uncertain: z.boolean().default(false),
});
export const parseOutputSchema = z.object({
    tasks: z.array(parsedTaskSchema).min(1),
});
