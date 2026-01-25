import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import { connectRabbitMQ } from "./services/rabbitmqService.js";
import router from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize RabbitMQ (optional, gracefully fails if not available)
connectRabbitMQ();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Swagger documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use("/api", router);

// 404 for unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  next();
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  res.status(status).json({ error: message });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Backend running on port 3000");
});