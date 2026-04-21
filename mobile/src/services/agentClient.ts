import { parseOutputSchema } from "./agentSchema";

const API_URL = process.env.EXPO_PUBLIC_ORBIT_API_URL ?? "http://localhost:8787";

export async function parseBrainDump(text: string) {
  const response = await fetch(`${API_URL}/agent/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
  });

  if (!response.ok) {
    throw new Error(`Parse failed with status ${response.status}`);
  }

  const data: unknown = await response.json();
  return parseOutputSchema.parse(data);
}
