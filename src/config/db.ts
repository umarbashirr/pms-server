import mongoose from "mongoose";

const connectToDB = async (uri: string): Promise<void> => {
  try {
    const conn = mongoose.connect(uri);

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
