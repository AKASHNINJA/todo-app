import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { fallbackParser, parseWithValidation } from "./agent/parse.js";
import { ParseInput, parseInputSchema } from "./agent/types.js";

const app = new Hono();

app.get("/health", (c) => c.json({ ok: true, service: "orbit-api" }));

app.post("/agent/parse", async (c) => {
  const payload = parseInputSchema.parse(await c.req.json());
  const output = await parseWithValidation(payload, callModel);
  return c.json(output);
});

const port = Number(process.env.PORT || 8787);
serve({ fetch: app.fetch, port });
console.log(`Orbit API running on http://localhost:${port}`);

async function callModel(input: ParseInput) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return fallbackParser(input);
  }

  // Anthropic SDK wiring point. Placeholder while keys are not configured.
  return fallbackParser(input);
}

export default app;
