import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";

// Routes Import Files
import routes from "./routes";
import { config } from "./config";
import { swaggerUi, swaggerSpec } from "./swagger";
import { errorHandler } from "./middlewares/error-handler.middleware";

// Initialize enviornment variables

const app: Express = express();

//  Middlewares
app.use(morgan("combined"));
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
routes.forEach((route) => {
  app.use(route.path, route.handler);
});

// Health Check Route
app.get("/health", async (req, res) => {
  try {
    const dbStatus = await mongoose.connection.readyState; // 1 for connected
    res.json({
      status: "UP",
      database: dbStatus === 1 ? "Connected" : "Disconnected",
    });
  } catch (error: any) {
    res.status(500).json({ status: "DOWN", error: error.message });
  }
});

app.use(errorHandler);

export default app;
