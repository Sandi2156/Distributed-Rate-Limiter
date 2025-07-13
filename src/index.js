import express from "express";
import { checkRateLimit } from "./limiter.js";
import { healthHandler } from "./health.js";
import config from "./config.js";

const app = express();
app.use(express.json());

app.get("/healthz", healthHandler);

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

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
