import { cors } from "@elysiajs/cors";
import { initTRPC } from "@trpc/server";
import { swagger } from "@elysiajs/swagger";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { Elysia, Static, TSchema, t as Type } from "elysia";
import { compile as c, trpc } from "@elysiajs/trpc";

import {
	SelectArticle,
	SelectSpecificPoint,
	SelectSupersetPoint,
	articles,
	insertArticles,
	insertSpecificPoints,
	insertSupersetPointsSchema,
	nanoid,
	selectArticlesSchema,
	selectSpecificPointsSchema,
	selectSupersetPointsSchema,
	specificPoints,
	supersetPoints,
} from "./db/schema";
import { db } from "./db";

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

export function parse<T extends TSchema>(schema: T, data: unknown) {
	try {
		const C = TypeCompiler.Compile(schema);
		const isValid = C.Check(data);
		if (!isValid) {
			const errors = [...C.Errors(data)];
			throw errors;
		}
		return C.Decode(data);
	} catch (error) {
		console.log("🚀 ~ data:", data);
		console.error(error);
	}
}

const BASE_URL = "https://3b2d-68-65-175-38.ngrok-free.app";
const EXECUTE_DATABASE_URL = `${BASE_URL}/execute_sql`;

async function execute<T extends TSchema>({
	sql,
	params,
	schema,
}: {
	sql: string;
	params: Record<string, unknown>;
	schema: T;
}): Promise<Static<T>> {
	const result = await fetch(EXECUTE_DATABASE_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ sql, params }),
	})
		.then((res) => {
			if (!res.ok) throw new Error("Failed to execute SQL");
			return res.json();
		})
		.then((data) => data.result)
		.then((rows) => {
			return rows.map((row: any) =>
				Object.entries(row).reduce((acc, [key, value]) => {
					if (key === "sentiment") {
						return { ...acc, [key]: JSON.parse(value.replaceAll("'", '"')) };
					}
					return { ...acc, [key]: value };
				}, {})
			);
		});
	return parse(schema, result);
}

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
			db.update(specificPoints).set({
				superset_point_id: input.superset_point_id,
			});
		}),
	insertSupersetPoints: t.procedure
		.input(c(insertSupersetPointsSchema))
		.mutation(async ({ input }) => {
			return db.insert(supersetPoints).values(input);
		}),
});

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
			const returnedFetch = await fetch(`${BASE_URL}/find_similar_articles`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url }),
			})
				.then((response) => response.json())
				.then((data) => {
					data.article.sentiment = JSON.parse(data.article.sentiment);
					data.relevantArticles = data.relevantArticles.map((article: any) => {
						article.sentiment = JSON.parse(article.sentiment);
						return article;
					});
					return parse(
						t.Object({
							article: t.Nullable(selectArticlesSchema),
							relevantArticles: t.Array(selectArticlesSchema),
						}),
						data
					);
				});
			if (!returnedFetch) throw new Error("Failed to fetch");
			const { article: thisArticle, relevantArticles } = returnedFetch;
			console.log("🚀 ~ thisArticle:", thisArticle);
			console.log("🚀 ~ relevantArticles:", relevantArticles);
			if (!thisArticle) throw new Error("Article not found");
			const thisArticleSpecificPoints = await execute({
				sql: "SELECT * FROM specific_points WHERE article_id = :id",
				params: { id: thisArticle.id },
				schema: t.Array(selectSpecificPointsSchema),
			});
			console.log("🚀 ~ thisArticleSpecificPoints:", thisArticleSpecificPoints);
			const supersetPoints = await execute({
				sql: "SELECT * FROM superset_points",
				params: {},
				schema: t.Array(selectSupersetPointsSchema),
			});
			console.log("🚀 ~ supersetPoints:", supersetPoints);
			return {
				thisArticle: {
					...thisArticle,
					specificPoints: thisArticleSpecificPoints,
				},
				relevantArticles: await Promise.all(
					relevantArticles.map(async (article) => {
						const specificPoints = await execute({
							sql: "SELECT * FROM specific_points WHERE article_id = :id",
							params: { id: article.id },
							schema: t.Array(selectSpecificPointsSchema),
						});
						return {
							...article,
							specificPoints,
						};
					})
				),
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
