import { InferSelectModel } from "drizzle-orm";
import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema, createInsertSchema } from "drizzle-typebox";
import { Static, t } from "elysia";
import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

export const sentimentSchema = t.Object({
	NEG: t.Number(),
	NEU: t.Number(),
	POS: t.Number(),
});

export type Sentiment = Static<typeof sentimentSchema>;

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

export const selectArticlesSchema = createSelectSchema(articles, {
	sentiment: sentimentSchema,
});
export type SelectArticle = InferSelectModel<typeof articles>;
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
	superset_point_id: text("superset_point_id"),
});

export type SelectSpecificPoint = InferSelectModel<typeof specificPoints>;

export const selectSpecificPointsSchema = createSelectSchema(specificPoints, {
	sentiment: sentimentSchema,
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

export type SelectSupersetPoint = InferSelectModel<typeof supersetPoints>;
export const selectSupersetPointsSchema = createSelectSchema(supersetPoints);
export const insertSupersetPointsSchema = createInsertSchema(supersetPoints);
