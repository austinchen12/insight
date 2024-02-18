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

const EXECUTE_DATABASE_URL =
	"https://8e0d-68-65-175-49.ngrok-free.app/execute_sql";

function execute(body: { sql: string; params: Record<string, unknown> }) {
	fetch(EXECUTE_DATABASE_URL, {
		method: "POST",
		body: JSON.stringify(body),
	});
}

const router = t.router({
	findSimilarArticles: t.procedure
		.input(z.object({ url: z.string() }))
		.query(({ input: { url } }) => {
			// ...
		}),
	insertArticles: t.procedure.input(insertArticles).mutation(({ input }) => {
		return execute({
			sql: "INSERT INTO articles (title, url, bias, sentiment, embedding) VALUES (:title, :url, :bias, :sentiment, :embedding)",
			params: input,
		});
	}),
	insertSpecificPoints: t.procedure
		.input(insertSpecificPoints)
		.mutation(async ({ input }) => {
			return execute({
				sql: "INSERT INTO specific_points (article_id, original_excerpt, embedding, bias, sentiment, superset_point_id) VALUES (:article_id, :original_excerpt, :embedding, :bias, :sentiment, :superset_point_id)",
				params: input,
			});
			// await db.insert(specificPoints).values(input);
		}),
	updateSpecificPoints: t.procedure
		.input(insertSpecificPoints)
		.mutation(async ({ input }) => {
			// await db.update(specificPoints).set({
			// 	superset_point_id: input.superset_point_id,
			// });
		}),
	insertSupersetPoints: t.procedure
		.input(insertSupersetPoints)
		.mutation(async ({ input }) => {
			return execute({
				sql: "INSERT INTO superset_points (title_generated, embedding) VALUES (:title_generated, :embedding)",
				params: input,
			});
			// await db.insert(supersetPoints).values(input);
		}),
});

export type Router = typeof router;

const app = new Elysia().use(swagger()).use(trpc(router)).listen(3000);

export type App = typeof app;
