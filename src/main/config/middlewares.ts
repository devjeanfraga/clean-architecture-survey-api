import { Express } from "express";
import { jsonParser } from "../middlewares/json-parser";
import { cors } from "../middlewares/cors";
import { contentType } from "../middlewares/content-type";

export default (app: Express) => {
  app.use(jsonParser);
  app.use(cors);
  app.use(contentType);
}; 
