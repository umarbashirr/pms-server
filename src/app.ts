import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

// Routes Import Files
import authRoutes from "./routes/auth.routes";
import propertiesRoutes from "./routes/properties.routes";
import roomTypeRoutes from "./routes/room-types.routes";
import roomRoutes from "./routes/room.routes";

// Initialize enviornment variables

const app: Express = express();

//  Middlewares
app.use(morgan("combined"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/pmsserver/auth", authRoutes);
app.use("/api/v1/pmsserver/properties", propertiesRoutes);
app.use("/api/v1/pmsserver/properties/:propertyId/room-types", roomTypeRoutes);
app.use("/api/v1/pmsserver/properties/:propertyId/rooms", roomRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("Hello, TypeScript Node Express!");
});

export default app;
