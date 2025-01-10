import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  dbUri: process.env.MONGO_URI || "mongodb://localhost:27017/pms",
  dbName: process.env.DB_NAME,
  jwtAccessSecret:
    process.env.JWT_ACCESS_SECRET || "secreatkjjkhj345392010njksi2",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "7d",
};
