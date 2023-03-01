import { Express } from "express";
import { jsonParser } from "../middlewares/json-parser";
import { cors } from "../middlewares/cors";

export default (app: Express) => {
  app.use(jsonParser);
  app.use(cors);
}; 
