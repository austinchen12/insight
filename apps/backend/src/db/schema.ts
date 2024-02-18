import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { customAlphabet } from "nanoid";
import { z } from "zod";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

export const sentimentSchema = z.object({
	NEG: z.number(),
	NEU: z.number(),
	POS: z.number(),
});

export type Sentiment = z.infer<typeof sentimentSchema>;

export const articles = sqliteTable("articles", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	title: text("title").notNull(),
	url: text("url").notNull(),
	bias: real("bias").notNull(),
	sentiment: text("sentiment", { mode: "json" }).$type<Sentiment>().notNull(),
	embedding: text("embedding", { mode: "json" }).notNull(),
});

export const insertArticles = createInsertSchema(articles, {
	sentiment: sentimentSchema,
});

export const specificPoints = sqliteTable("specific_points", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	article_id: text("article_id").notNull(),
	original_excerpt: text("original_excerpt").notNull(),
	embedding: text("embedding", { mode: "json" }).notNull(),
	bias: real("bias").notNull(),
	sentiment: text("sentiment", { mode: "json" }).$type<Sentiment>().notNull(),
	superset_point_id: text("superset_point_id").notNull(),
});

export const insertSpecificPoints = createInsertSchema(specificPoints, {
	sentiment: sentimentSchema,
});

export const supersetPoints = sqliteTable("superset_points", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	title_generated: text("title_generated").notNull(),
	embedding: text("embedding", { mode: "json" }).notNull(),
});

export const insertSupersetPoints = createInsertSchema(supersetPoints);
