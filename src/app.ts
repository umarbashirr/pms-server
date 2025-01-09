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
import profileRoutes from "./routes/profiles.routes";
import occupanyRoutes from "./routes/occupancy.routes";
import reservationRoutes from "./routes/reservation.routes";
import paymentRoutes from "./routes/payment.routes";

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
app.use("/api/v1/pmsserver/properties/:propertyId/profiles", profileRoutes);
app.use(
  "/api/v1/pmsserver/properties/:propertyId/check-availability",
  occupanyRoutes
);
app.use(
  "/api/v1/pmsserver/properties/:propertyId/reservation",
  reservationRoutes
);

app.use(
  "/api/v1/pmsserver/properties/:propertyId/reservation/:reservationId/payments",
  paymentRoutes
);

// Health Check Route
app.get("/", (req, res) => {
  res.send("Hello, TypeScript Node Express!");
});

export default app;
