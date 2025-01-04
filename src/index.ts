require("dotenv").config();

import app from "./app";
import connectToDB from "./config/db";

const port = process.env.PORT || 5000;

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
