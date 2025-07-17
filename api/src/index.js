import express from "express";
import authRouter from "./routes/authRoutes.js"
import config from "./utils/config.js";
import { connectMongo } from "./models/db.js";
import apiRegistrationRoutes from "./routes/apiRegistrationRoutes.js";
import algorithmRoutes from "./routes/algorithmRoutes.js";
import proxyRoutes from "./routes/proxyRoutes.js";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use('/api', apiRegistrationRoutes);
app.use('/algorithms', algorithmRoutes);
app.use('/proxy', proxyRoutes);


async function start() {
    await connectMongo(config.db.mongoUrl);
    app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
    });
}

start();
