import { swagger } from "@elysiajs/swagger";
import { trpc } from "@elysiajs/trpc";
import { initTRPC } from "@trpc/server";
import { Elysia } from "elysia";
import { z } from "zod";
import { db } from "./db";
import {
	articles,
	insertArticles,
	insertSpecificPoints,
	insertSupersetPoints,
	specificPoints,
	supersetPoints,
} from "./db/schema";

const t = initTRPC.create();

const router = t.router({
	findSimilarArticles: t.procedure
		.input(z.object({ url: z.string() }))
		.query(({ input: { url } }) => {
			// ...
		}),
	insertArticles: t.procedure.input(insertArticles).query(async ({ input }) => {
		await db.insert(articles).values(input);
	}),
	insertSpecificPoints: t.procedure
		.input(insertSpecificPoints)
		.query(async ({ input }) => {
			await db.insert(specificPoints).values(input);
		}),
	updateSpecificPoints: t.procedure
		.input(insertSpecificPoints)
		.query(async ({ input }) => {
			await db.update(specificPoints).set({
				superset_point_id: input.superset_point_id,
			});
		}),
	insertSupersetPoints: t.procedure
		.input(insertSupersetPoints)
		.query(async ({ input }) => {
			await db.insert(supersetPoints).values(input);
		}),
});

const app = new Elysia().use(swagger()).use(trpc(router)).listen(3000);

export type App = typeof app;
