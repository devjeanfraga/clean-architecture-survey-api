import express from 'express';
import SetupMiddlewares from '../config/middlewares';
import SetupRoutes from '../config/routes';


const app = express();
SetupMiddlewares(app);
SetupRoutes(app);

export default app;