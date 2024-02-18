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
	findSimilarArticles: p
		.input(c(Type.Object({ url: Type.String() })))
		.query(({ input: { url } }) => {
			// ...
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
