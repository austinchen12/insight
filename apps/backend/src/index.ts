import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { db } from "./db";
import { articles, specificPoints, supersetPoints } from "./db/schema";

const app = new Elysia()
	.use(swagger())
	.post("/articles", async ({ body }) => {
		await db.insert(articles).values(body);
	})
	.post("/specific_points", async ({ body }) => {
		await db.insert(specificPoints).values(body);
	})
	.put("/specific_points", async ({ body }) => {
		await db.update(specificPoints).set({
			supersetPointId: body.supersetPointId,
		});
	})
	.post("/superset_points", async ({ body }) => {
		await db.insert(supersetPoints).values(body);
	})
	.listen(3000);
