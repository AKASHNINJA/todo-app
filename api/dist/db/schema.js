import { boolean, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
export const tasks = pgTable("tasks", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    title: varchar("title", { length: 240 }).notNull(),
    description: text("description"),
    vibeTags: text("vibe_tags").array().notNull().default([]),
    dueAt: timestamp("due_at", { withTimezone: true }),
    remindAt: timestamp("remind_at", { withTimezone: true }),
    location: text("location"),
    status: varchar("status", { length: 24 }).notNull().default("active"),
    recurrenceRule: text("recurrence_rule"),
    createdVia: varchar("created_via", { length: 40 }).notNull().default("brain_dump"),
    energyEstimate: integer("energy_estimate"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
});
export const workflows = pgTable("workflows", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    naturalLanguageDescription: text("natural_language_description").notNull(),
    triggerJson: jsonb("trigger_json").notNull(),
    actionsJson: jsonb("actions_json").notNull(),
    enabled: boolean("enabled").notNull().default(true),
    lastRunAt: timestamp("last_run_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
