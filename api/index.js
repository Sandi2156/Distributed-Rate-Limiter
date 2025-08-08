import app from "./server.js";
import serverLessExpress from "@vendia/serverless-express";
import { connectMongo } from "./src/models/db.js";
import config from "./src/utils/config.js";

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

if (config.env === "localhost") {
  async function start() {
    await connectMongo(config.db.mongoUrl);
    app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
    });
  }

  await start();
}

export const handler = handlerFn;
