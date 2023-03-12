import { Express, Router } from 'express';
import { readdirSync } from 'fs';

export default (app:Express) : void => {
  const router = Router();
  app.use('/clean-api', router);

  readdirSync(`${__dirname}/../routes`).map(async file => {
    const isFileTestOrBuild = file.includes('.test') || file.includes('.map');
    const fileRoutes  = (await import(`../routes/${file}`)).default;
    
    if(!isFileTestOrBuild && fileRoutes) {
      fileRoutes(router);
    }
  });
};
