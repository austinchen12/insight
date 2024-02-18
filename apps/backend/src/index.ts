import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { Elysia, TSchema, t } from "elysia";
import {
	SelectArticle,
	SelectSpecificPoint,
	SelectSupersetPoint,
	insertArticles,
	insertSpecificPoints,
	insertSupersetPointsSchema,
	nanoid,
	selectArticlesSchema,
	selectSpecificPointsSchema,
	selectSupersetPointsSchema,
} from "./db/schema";

export type SelectArticleJoinedSpecificPoints = SelectArticle & {
	specificPoints: SelectSpecificPoint[];
};

export type GlobalData = {
	thisArticle: SelectArticleJoinedSpecificPoints;
	relevantArticles: SelectArticleJoinedSpecificPoints[];
	supersetPoints: SelectSupersetPoint[];
};

export function parse<T extends TSchema>(schema: T, data: unknown) {
	const C = TypeCompiler.Compile(schema);
	const isValid = C.Check(data);
	if (!isValid) throw [...C.Errors(data)];
	return C.Decode(data);
}

const BASE_URL = "https://481a-68-65-175-37.ngrok-free.app";
const EXECUTE_DATABASE_URL = `${BASE_URL}/execute_sql`;

async function execute<T extends TSchema>({
	sql,
	params,
	schema,
}: {
	sql: string;
	params: Record<string, unknown>;
	schema: T;
}) {
	console.log(
		"🚀 ~ JSON.stringify({ sql, params }):",
		JSON.stringify({ sql, params })
	);
	const result = await fetch(EXECUTE_DATABASE_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ sql, params }),
	}).then((res) => {
		console.log("🚀 ~ res:", res);
		if (!res.ok) throw new Error("Failed to execute SQL");
		console.log(res);
		return res.json();
	});
	console.log("🚀 ~ result:", result);
	try {
		return parse(schema, result);
	} catch (e) {
		console.error({ e, sql, params, result });
	}
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
	.use(
		cors({
			allowedHeaders: ["*"],
		})
	)
	.get("/", () => "Hello, world!")
	.get(
		"/getGlobalData",
		async ({ query }): Promise<GlobalData> => {
			const { url } = query;
			console.log("🚀 ~ url:", url);
			const relevantArticles2 = await fetch(
				`${BASE_URL}/find_similar_articles`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ url }),
				}
			).then((response) => response.json());
			console.log("🚀 ~ relevantArticles2:", relevantArticles2);
			const thisArticle = await execute({
				sql: "SELECT * FROM articles WHERE url = :url",
				params: { url },
				schema: selectArticlesSchema,
			});
			console.log("🚀 ~ thisArticle:", thisArticle);
			const thisArticleSpecificPoints = await execute({
				sql: "SELECT * FROM specific_points WHERE article_id = :id",
				params: { id: thisArticle.id },
				schema: t.Array(selectSpecificPointsSchema),
			});
			console.log("🚀 ~ thisArticleSpecificPoints:", thisArticleSpecificPoints);
			const relevantArticles = await execute({
				sql: "SELECT * FROM articles WHERE url != :url",
				params: { url },
				schema: t.Array(selectArticlesSchema),
			});
			const relevantArticlesWithSpecificPoints: SelectArticleJoinedSpecificPoints[] =
				await Promise.all(
					relevantArticles.map(async (article) => {
						const specificPoints = await execute({
							sql: "SELECT * FROM specific_points WHERE article_id = :id",
							params: { id: article.id },
							schema: t.Array(selectSpecificPointsSchema),
						});
						return { ...article, specificPoints };
					})
				);
			const supersetPoints = await execute({
				sql: "SELECT * FROM superset_points",
				params: {},
				schema: t.Array(selectSupersetPointsSchema),
			});
			return {
				thisArticle: {
					...thisArticle,
					specificPoints: thisArticleSpecificPoints,
				},
				relevantArticles: relevantArticlesWithSpecificPoints,
				supersetPoints,
			};
		},
		{
			query: t.Object({ url: t.String() }),
		}
	)
	.post(
		"/articles",
		({ body }) => {
			return execute({
				sql: "INSERT INTO articles (id, title, url, bias, sentiment, embedding) VALUES (:id, :title, :url, :bias, :sentiment, :embedding)",
				params: body,
				schema: t.Unknown(),
			});
			// await db.insert(articles).values(body);
		},
		{
			body: insertArticles,
			transform({ body }) {
				if (!body.id) body.id = nanoid();
			},
		}
	)
	.post(
		"/specific_points",
		({ body }) => {
			return execute({
				sql: "INSERT INTO specific_points (id, article_id, original_excerpt, embedding, bias, sentiment, superset_point_id) VALUES (:id, :article_id, :original_excerpt, :embedding, :bias, :sentiment, :superset_point_id)",
				params: body,
				schema: t.Unknown(),
			});
			// await db.insert(specificPoints).values(body);
		},
		{
			body: insertSpecificPoints,
			transform({ body }) {
				if (!body.id) body.id = nanoid();
			},
		}
	)
	.put(
		"/specific_points",
		({ body }) => {
			return execute({
				sql: "UPDATE specific_points SET superset_point_id = :superset_point_id",
				params: body,
				schema: t.Unknown(),
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
				sql: "INSERT INTO superset_points (id, title_generated, embedding) VALUES (:id, :title_generated, :embedding)",
				params: body,
				schema: t.Unknown(),
			});
			// await db.insert(supersetPoints).values(body);
		},
		{
			body: insertSupersetPointsSchema,
			transform({ body }) {
				if (!body.id) body.id = nanoid();
			},
		}
	)
	.listen(3000);

export type App = typeof app;
