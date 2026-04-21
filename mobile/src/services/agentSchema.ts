import { z } from "zod";

const vibeTagSchema = z.enum(["grind", "chill", "errand", "deep", "someday", "ugh"]);

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

export type ParsedTask = z.infer<typeof parsedTaskSchema>;
export type ParseOutput = z.infer<typeof parseOutputSchema>;
