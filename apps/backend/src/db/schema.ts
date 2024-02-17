import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { customAlphabet } from "nanoid";
import { z } from "zod";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

export const biasSchema = z
	.tuple([
		z.tuple([
			z.object({
				label: z.union([z.literal("Non-biased"), z.literal("Biased")]),
				score: z.number(),
			}),
		]),
	])
	.transform((bias) => bias[0][0]);

export const sentimentSchema = z
	.tuple([
		z.tuple([
			z.object({
				label: z.literal("POS"),
				score: z.number(),
			}),
			z.object({
				label: z.literal("NEU"),
				score: z.number(),
			}),
			z.object({
				label: z.literal("NEG"),
				score: z.number(),
			}),
		]),
	])
	.transform((sentiment) => sentiment[0]);

export type Bias = z.infer<typeof biasSchema>;
export type Sentiment = z.infer<typeof sentimentSchema>;

export const articles = sqliteTable("articles", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	title: text("title").notNull(),
	bias: text("bias", { mode: "json" }).$type<Bias>().notNull(),
	sentiment: text("sentiment", { mode: "json" }).$type<Sentiment>().notNull(),
	embedding: text("embedding", { mode: "json" }).notNull(),
});

export const specificPoints = sqliteTable("specific_points", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	articleId: text("article_id").notNull(),
	originalExcerpt: text("original_excerpt").notNull(),
	embedding: text("embedding", { mode: "json" }).notNull(),
	bias: text("bias", { mode: "json" }).$type<Bias>().notNull(),
	sentiment: text("sentiment", { mode: "json" }).$type<Sentiment>().notNull(),
	supersetPointId: text("superset_point_id").notNull(),
});

export const supersetPoints = sqliteTable("superset_points", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	titleGenerated: text("title_generated").notNull(),
	embedding: text("embedding", { mode: "json" }).notNull(),
});
