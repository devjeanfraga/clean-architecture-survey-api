import express from 'express';
import SetupMiddlewares from '../config/middlewares';


const app = express();
SetupMiddlewares(app);

export default app;