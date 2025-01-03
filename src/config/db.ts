import mongoose from "mongoose";

const URI = process.env.MONGO_URI;
const DBNAME = process.env.DB_NAME;

const COMPLETE_URI = `${URI}/${DBNAME}`;

const connectToDB = async (): Promise<void> => {
  try {
    const conn = mongoose.connect(COMPLETE_URI);

    if (!conn) {
      throw new Error("Error while connecting to Database!");
    }

    console.log("Server connected with Database!");
  } catch (error: any) {
    console.log(error);
    process.exit(1);
  }
};

export default connectToDB;
