import { swagger } from "@elysiajs/swagger";
import { compile as c, trpc } from "@elysiajs/trpc";
import { initTRPC } from "@trpc/server";
import { Elysia, t as Type } from "elysia";
import { db } from "./db";
import {
	SelectArticle,
	SelectSpecificPoint,
	SelectSupersetPoint,
	articles,
	insertArticles,
	insertSpecificPoints,
	insertSupersetPointsSchema,
	specificPoints,
	supersetPoints,
} from "./db/schema";
import { eq } from "drizzle-orm";

export type SelectArticleJoinedSpecificPoints = SelectArticle & {
	specificPoints: SelectSpecificPoint[];
};

export type SelectSupersetPointJoinedSpecificPoints = SelectSupersetPoint & {
	specificPoints: SelectSpecificPoint[];
};

export type GlobalData = {
	thisArticle: SelectArticleJoinedSpecificPoints;
	relevantArticles: SelectArticleJoinedSpecificPoints[];
	supersetPoints: SelectSupersetPoint[];
};

const t = initTRPC.create();
const p = t.procedure;

const router = t.router({
	getGlobalData: p
		.input(c(Type.Object({ url: Type.String() })))
		.query(async ({ input: { url } }): Promise<GlobalData> => {
			const thisArticleWithSpecificPoints = await db.query.articles.findFirst({
				where: eq(articles.url, url),
				with: {
					specificPoints: true,
				},
			});
			if (!thisArticleWithSpecificPoints) {
				throw new Error("Article not found");
			}
			const getRelevantArticles = (article: SelectArticle) => {};
			const relevantArticles = getRelevantArticles(
				thisArticleWithSpecificPoints
			);
			const supersetPoints = await db.query.supersetPoints.findMany();
			return {
				thisArticle: thisArticleWithSpecificPoints,
				relevantArticles,
				supersetPoints,
			};
		}),
	insertArticles: p.input(c(insertArticles)).mutation(({ input }) => {
		return db.insert(articles).values(input);
	}),
	insertSpecificPoints: p
		.input(c(insertSpecificPoints))
		.mutation(async ({ input }) => {
			return db.insert(specificPoints).values(input);
		}),
	updateSpecificPoints: t.procedure
		.input(c(insertSpecificPoints))
		.mutation(async ({ input }) => {
			return db.update(specificPoints).set({
				superset_point_id: input.superset_point_id,
			});
		}),
	insertSupersetPoints: t.procedure
		.input(c(insertSupersetPointsSchema))
		.mutation(async ({ input }) => {
			return db.insert(supersetPoints).values(input);
		}),
});

export type Router = typeof router;

const app = new Elysia().use(swagger()).use(trpc(router)).listen(3000);
