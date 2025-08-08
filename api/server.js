import express from "express";
import authRouter from "./src/routes/authRoutes.js";
import apiRegistrationRoutes from "./src/routes/apiRegistrationRoutes.js";
import algorithmRoutes from "./src/routes/algorithmRoutes.js";
import proxyRoutes from "./src/routes/proxyRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );
app.use(cors());

app.use("/auth", authRouter);
app.use("/api", apiRegistrationRoutes);
app.use("/algorithms", algorithmRoutes);
app.use("/proxy", proxyRoutes);

app.get("/health-check", async (req, res) => {
  res.json({ message: "OK" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
});

export default app;
