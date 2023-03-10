import * as dotenv from 'dotenv'; 
dotenv.config();
import { MongoHelper } from "../infra/db/mongodb/mongo-helpers";
import env from './config/env'; 
   MongoHelper.connect(env.dbUri)
    .then(async ()=> {
      const app = (await import("./config/app")).default
      app.listen(env.port, () => console.log(`App run on http://localhost:${env.port}`));
  }).catch(err => console.log(err));
  
 