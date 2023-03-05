import supertest from "supertest";
import app from "./src/main/config/app";

global.testRequest = supertest(app); 