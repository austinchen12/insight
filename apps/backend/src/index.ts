import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { db } from "./db";
import {
	articles,
	insertArticles,
	insertSpecificPoints,
	insertSupersetPoints,
	specificPoints,
	supersetPoints,
} from "./db/schema";

const app = new Elysia()
	.use(swagger())
	.post(
		"/articles",
		async ({ body }) => {
			await db.insert(articles).values({
				...body,
				bias: body.bias[0],
				sentiment: body.sentiment[0][0],
			});
		},
		{ body: insertArticles }
	)
	.post(
		"/specific_points",
		async ({ body }) => {
			await db.insert(specificPoints).values({
				...body,
				bias: body.bias[0],
				sentiment: body.sentiment[0][0],
			});
		},
		{ body: insertSpecificPoints }
	)
	.put(
		"/specific_points",
		async ({ body }) => {
			await db.update(specificPoints).set({
				superset_point_id: body.superset_point_id,
			});
		},
		{ body: t.Pick(insertSpecificPoints, ["superset_point_id"]) }
	)
	.post(
		"/superset_points",
		async ({ body }) => {
			await db.insert(supersetPoints).values(body);
		},
		{ body: insertSupersetPoints }
	)
	.listen(3000);
