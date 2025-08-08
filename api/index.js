import app from "./server.js";
import serverLessExpress from "@vendia/serverless-express";
import { connectMongo } from "./src/models/db.js";

let serverlessExpressInstance;

async function setup(event, context) {
  await connectMongo(config.db.mongoUrl);

  serverlessExpressInstance = serverLessExpress({ app });
  return serverlessExpressInstance(event, context);
}

function handlerFn(event, context) {
  if (serverlessExpressInstance)
    return serverlessExpressInstance(event, context);

  return setup(event, context);
}

// async function start() {
//   await connectMongo(config.db.mongoUrl);
//   app.listen(config.server.port, () => {
//     console.log(`Server running on port ${config.server.port}`);
//   });
// }

// start();

export const handler = handlerFn;
