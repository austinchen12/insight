import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger'

const app = new Elysia().use(swagger())
  .post("/articles", () => "Insert article")
  .post("/specific_points", () => "Insert specific_point")
  .put("/specific_points", () => "Update relations superset_point_id")
  .post("/superset_points", () => "Insert superset_point")
  .listen(3000);