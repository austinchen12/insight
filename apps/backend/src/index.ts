import { swagger } from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import {
	insertArticles,
	insertSpecificPoints,
	insertSupersetPoints,
} from "./db/schema";

const EXECUTE_DATABASE_URL =
	"https://8e0d-68-65-175-49.ngrok-free.app/execute_sql";

function execute(body: { sql: string; params: Record<string, unknown> }) {
	fetch(EXECUTE_DATABASE_URL, {
		method: "POST",
		body: JSON.stringify(body),
	});
}

// const t = initTRPC.create();
//
// const router = t.router({
// 	findSimilarArticles: t.procedure
// 		.input(z.object({ url: z.string() }))
// 		.query(({ input: { url } }) => {
// 			// ...
// 		}),
// 	insertArticles: t.procedure.input(insertArticles).mutation(({ input }) => {
// 		return execute({
// 			sql: "INSERT INTO articles (title, url, bias, sentiment, embedding) VALUES (:title, :url, :bias, :sentiment, :embedding)",
// 			params: input,
// 		});
// 	}),
// 	insertSpecificPoints: t.procedure
// 		.input(insertSpecificPoints)
// 		.mutation(async ({ input }) => {
// 			return execute({
// 				sql: "INSERT INTO specific_points (article_id, original_excerpt, embedding, bias, sentiment, superset_point_id) VALUES (:article_id, :original_excerpt, :embedding, :bias, :sentiment, :superset_point_id)",
// 				params: input,
// 			});
// 			// await db.insert(specificPoints).values(input);
// 		}),
// 	updateSpecificPoints: t.procedure
// 		.input(insertSpecificPoints)
// 		.mutation(async ({ input }) => {
// 			// await db.update(specificPoints).set({
// 			// 	superset_point_id: input.superset_point_id,
// 			// });
// 		}),
// 	insertSupersetPoints: t.procedure
// 		.input(insertSupersetPoints)
// 		.mutation(async ({ input }) => {
// 			return execute({
// 				sql: "INSERT INTO superset_points (title_generated, embedding) VALUES (:title_generated, :embedding)",
// 				params: input,
// 			});
// 			// await db.insert(supersetPoints).values(input);
// 		}),
// });

// export type Router = typeof router;

// const app = new Elysia().use(swagger()).use(trpc(router)).listen(3000);

const app = new Elysia()
	.use(swagger())
	.get(
		"/articles/find-similar",
		({ body }) => {
			// ...
		},
		{
			body: t.Object({ url: t.String() }),
		}
	)
	.post(
		"/articles",
		({ body }) => {
			return execute({
				sql: "INSERT INTO articles (title, url, bias, sentiment, embedding) VALUES (:title, :url, :bias, :sentiment, :embedding)",
				params: body,
			});
			// await db.insert(articles).values(body);
		},
		{ body: insertArticles }
	)
	.post(
		"/specific_points",
		({ body }) => {
			return execute({
				sql: "INSERT INTO specific_points (article_id, original_excerpt, embedding, bias, sentiment, superset_point_id) VALUES (:article_id, :original_excerpt, :embedding, :bias, :sentiment, :superset_point_id)",
				params: body,
			});
			// await db.insert(specificPoints).values(body);
		},
		{ body: insertSpecificPoints }
	)
	.put(
		"/specific_points",
		({ body }) => {
			return execute({
				sql: "UPDATE specific_points SET superset_point_id = :superset_point_id",
				params: body,
			});
			// await db.update(specificPoints).set({
			// 	superset_point_id: body.superset_point_id,
			// });
		},
		{ body: t.Pick(insertSpecificPoints, ["superset_point_id"]) }
	)
	.post(
		"/superset_points",
		({ body }) => {
			return execute({
				sql: "INSERT INTO superset_points (title_generated, embedding) VALUES (:title_generated, :embedding)",
				params: body,
			});
			// await db.insert(supersetPoints).values(body);
		},
		{ body: insertSupersetPoints }
	)
	.listen(3000);

export type App = typeof app;
