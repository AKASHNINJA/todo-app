export type VibeTag = "grind" | "chill" | "errand" | "deep" | "someday" | "ugh";

export type OrbitTask = {
  id: string;
  title: string;
  dueAt: string | null;
  remindAt: string | null;
  vibeTags: VibeTag[];
  status: "active" | "done" | "snoozed";
  createdAt: string;
  completedAt: string | null;
  uncertain?: boolean;
};
