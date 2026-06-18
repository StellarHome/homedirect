import express from "express";
import cors from "cors";
import helmet from "helmet";
import { leaseRouter } from "./routes/lease";
import { propertyRouter } from "./routes/property";
import { userRouter } from "./routes/user";
import { webhookRouter } from "./routes/webhook";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "10mb" }));

// ── Health check ───────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", network: process.env.STELLAR_NETWORK || "testnet" });
});

// ── Routes ─────────────────────────────────────────────────────────
app.use("/api/v1/leases", leaseRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/webhooks", webhookRouter);

// ── 404 handler ────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Error handler ──────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`HomeDirect Relayer running on port ${PORT}`);
  console.log(`Stellar network: ${process.env.STELLAR_NETWORK || "testnet"}`);
});

export default app;
