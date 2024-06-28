import dotenv from "dotenv";
import mongoose from "mongoose";

// DOTENV CONFIGURATION
dotenv.config();

// CONFIGURATION
mongoose.set("strictQuery", true);

// MONGODB CONNECTION
export const mongodbConnection = async () => {
     try {
          await mongoose.connect(process.env.MONGO_URL!);
          console.log("MongoDB connected");
     } catch (error) {
          console.error("Error connecting to MongoDB:", error);
     }
};

export default mongodbConnection;