import { Elysia } from "elysia";

const app = new Elysia()
  .post("/articles", () => "Insert article")
  .post("/specific_points", () => "Insert specific_point")
  .put("/specific_points", () => "Update relations superset_point_id")
  .post("/superset_points", () => "Insert superset_point")
  .listen(3000);