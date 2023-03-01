import { Express } from "express";
import { jsonParser } from "../middlewares/json-parser";

export default (app: Express) => {
  app.use(jsonParser); 
}; 
