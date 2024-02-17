import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { customAlphabet } from "nanoid";
import { Static, t } from "elysia";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

export const biasSchema = t.Tuple([
	t.Tuple([
		t.Object({
			label: t.Union([t.Literal("Non-biased"), t.Literal("Biased")]),
			score: t.Number(),
		}),
	]),
]);
// .transform((bias) => bias[0][0]);

export const sentimentSchema = t.Tuple([
	t.Tuple([
		t.Object({
			label: t.Literal("POS"),
			score: t.Number(),
		}),
		t.Object({
			label: t.Literal("NEU"),
			score: t.Number(),
		}),
		t.Object({
			label: t.Literal("NEG"),
			score: t.Number(),
		}),
	]),
]);
// .transform((sentiment) => sentiment[0]);

export type Bias = Static<typeof biasSchema>;
export type Sentiment = Static<typeof sentimentSchema>;

export const articles = sqliteTable("articles", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	title: text("title").notNull(),
	url: text("url").notNull(),
	bias: text("bias", { mode: "json" }).$type<Bias>().notNull(),
	sentiment: text("sentiment", { mode: "json" }).$type<Sentiment>().notNull(),
	embedding: text("embedding", { mode: "json" }).notNull(),
});

export const insertArticles = createInsertSchema(articles, {
	bias: biasSchema,
	sentiment: sentimentSchema,
});

export const specificPoints = sqliteTable("specific_points", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	article_id: text("article_id").notNull(),
	original_excerpt: text("original_excerpt").notNull(),
	embedding: text("embedding", { mode: "json" }).notNull(),
	bias: text("bias", { mode: "json" }).$type<Bias>().notNull(),
	sentiment: text("sentiment", { mode: "json" }).$type<Sentiment>().notNull(),
	superset_point_id: text("superset_point_id").notNull(),
});

export const insertSpecificPoints = createInsertSchema(specificPoints, {
	bias: biasSchema,
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
