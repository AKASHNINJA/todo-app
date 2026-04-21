import { ParseInput, ParseOutput, parseOutputSchema } from "./types.js";

export type ParseModelCall = (input: ParseInput, attempt: number) => Promise<unknown>;

const MAX_ATTEMPTS = 2;

export async function parseWithValidation(input: ParseInput, callModel: ParseModelCall): Promise<ParseOutput> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const raw = await callModel(input, attempt);
      return parseOutputSchema.parse(raw);
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Parse validation failed after ${MAX_ATTEMPTS} attempts: ${String(lastError)}`);
}

export async function fallbackParser(input: ParseInput): Promise<ParseOutput> {
  return parseOutputSchema.parse({
    tasks: [
      {
        title: input.text,
        dueAt: null,
        remindAt: null,
        vibeTags: ["grind"],
        uncertain: false,
      },
    ],
  });
}
