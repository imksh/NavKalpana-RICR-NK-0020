import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `DataBase is connected at ${conn.connection.name} @ ${conn.connection.host}:${conn.connection.port}`
    );
  } catch (error) {
    console.log("Error in connectDB config: ", error);
    process.exit(1);
  }
};

export default connectDB;
