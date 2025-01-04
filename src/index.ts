require("dotenv").config();

import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

// Custom Imports
import connectToDB from "./config/db";

// Routes Import Files
import authRoutes from "./routes/auth.routes";
import propertiesRoutes from "./routes/properties.routes";

// Initialize enviornment variables

const app: Express = express();
const port = process.env.PORT || 5000;

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

// Health Check Route
app.get("/", (req, res) => {
  res.send("Hello, TypeScript Node Express!");
});

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
