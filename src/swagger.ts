import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { config } from "./config";

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel Management API",
      version: "1.0.0",
      description: "API documentation for the Hotel Management System",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`, // Replace with your API base URL
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Path to files containing annotations
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };
