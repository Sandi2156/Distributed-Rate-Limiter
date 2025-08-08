import express from "express";
import authRouter from "./src/routes/authRoutes.js";
import config from "./src/utils/config.js";
import { connectMongo } from "./src/models/db.js";
import apiRegistrationRoutes from "./src/routes/apiRegistrationRoutes.js";
import algorithmRoutes from "./src/routes/algorithmRoutes.js";
import proxyRoutes from "./src/routes/proxyRoutes.js";
import cors from "cors";
import serverLessExpress from "@vendia/serverless-express";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/api", apiRegistrationRoutes);
app.use("/algorithms", algorithmRoutes);
app.use("/proxy", proxyRoutes);

app.get("/ping", async (req, res) => {
  res.json({ message: "pong" });
});

connectMongo(config.db.mongoUrl);

// async function start() {
//   await connectMongo(config.db.mongoUrl);
//   app.listen(config.server.port, () => {
//     console.log(`Server running on port ${config.server.port}`);
//   });
// }

// start();
export const handler = serverlessExpress({ app });
