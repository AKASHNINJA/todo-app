import { parseOutputSchema } from "./types.js";
const MAX_ATTEMPTS = 2;
export async function parseWithValidation(input, callModel) {
    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        try {
            const raw = await callModel(input, attempt);
            return parseOutputSchema.parse(raw);
        }
        catch (error) {
            lastError = error;
        }
    }
    throw new Error(`Parse validation failed after ${MAX_ATTEMPTS} attempts: ${String(lastError)}`);
}
export async function fallbackParser(input) {
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
