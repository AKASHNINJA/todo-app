import { inngest } from "./inngest.js";
export const dailyReviewWorkflow = inngest.createFunction({ id: "daily-review-workflow", retries: 1 }, async ({ event, step }) => {
    const payload = event.data;
    const summary = await step.run("compose-summary", async () => "Daily review workflow placeholder executed.");
    return {
        ok: true,
        userId: String(payload.userId ?? "unknown"),
        summary,
    };
});
