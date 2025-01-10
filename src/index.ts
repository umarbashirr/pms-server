require("dotenv").config();

import app from "./app";
import { config } from "./config";
import connectToDB from "./config/db";

connectToDB(`${config.dbUri}/${config.dbName}`)
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
