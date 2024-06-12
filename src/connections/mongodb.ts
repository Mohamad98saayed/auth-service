import dotenv from "dotenv";
import mongoose from "mongoose";

// DOTENV CONFIGURATION
dotenv.config();

// CONFIGURATION
mongoose.set("strictQuery", true);

// DB CONNECTION
const mongodbConnection = async () => {
     await mongoose
          .connect(`${process.env.MONGO_URL}`)
          .catch(error => console.error(error))
          .then(() => console.log("mongo db connected"));
};

export default mongodbConnection;