import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const activities = sqliteTable("activities", {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    course: text().notNull(),
})

export const activityCache = sqliteTable("activityCache", {
    id: text().primaryKey().notNull(),
    activityId: text().notNull(),
    userId: text().notNull(),
    cachedAnswers: text().notNull()
})

export const progress = sqliteTable("progress", {
    id: text().primaryKey().notNull(),
    userId: text().notNull(),
    activityId: text().notNull(),
    progress: integer().notNull(),
    timeTaken: text().notNull(),
    status: text().notNull(),
})

export const activityResults = sqliteTable("activityResults", {
    id: text().primaryKey().notNull(),
    userId: text().notNull(),
    activityId: text().notNull(),
    grade: integer().notNull(),
    dateOfGrading: text().notNull(),
})