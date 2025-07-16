import express from "express";
import { checkRateLimit } from "./limiter.js";
import authRouter from "./routes/authRoutes.js"
import healthRouter from "./routes/healthRoutes.js";
import config from "./config.js";
import { connectMongo } from "./models/db.js";
import apiRegistrationRoutes from "./routes/apiRegistrationRoutes.js";
import { proxyRequest } from "./services/proxyService.js";
import { authenticateToken } from "./middleware/authMiddleWare.js";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/healthz", healthRouter);
app.use('/api', apiRegistrationRoutes);

// Add proxy route
app.post('/proxy', authenticateToken, proxyRequest);


app.post("/check", async (req, res) => {
  try {
    const { client_id, limit, window } = req.body;
    if (!client_id || !limit || !window) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const result = await checkRateLimit(client_id, limit, window);
    res.json(result);
  } catch (err) {
    console.error("Error in /check:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function start() {
    await connectMongo(config.db.mongoUrl);
    app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
    });
}

start();
