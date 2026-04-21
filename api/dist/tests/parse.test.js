import { describe, expect, it } from "vitest";
import { parseWithValidation } from "../agent/parse.js";
describe("parseWithValidation", () => {
    it("returns parsed output when model returns valid shape", async () => {
        const result = await parseWithValidation({ text: "Gym tomorrow", timezone: "UTC" }, async () => ({
            tasks: [{ title: "Gym tomorrow", dueAt: null, remindAt: null, vibeTags: ["grind"], uncertain: false }],
        }));
        expect(result.tasks).toHaveLength(1);
        expect(result.tasks[0]?.title).toBe("Gym tomorrow");
    });
    it("retries once and succeeds on second attempt", async () => {
        let attempts = 0;
        const result = await parseWithValidation({ text: "Call mom", timezone: "UTC" }, async () => {
            attempts += 1;
            if (attempts === 1)
                return { bad: true };
            return { tasks: [{ title: "Call mom", dueAt: null, remindAt: null, vibeTags: ["chill"], uncertain: true }] };
        });
        expect(attempts).toBe(2);
        expect(result.tasks[0]?.uncertain).toBe(true);
    });
});
