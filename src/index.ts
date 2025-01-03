import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

// Initialize enviornment variables
dotenv.config();

const app = express();
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

app.get("/", (req, res) => {
  res.send("Hello, TypeScript Node Express!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
