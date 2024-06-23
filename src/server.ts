import dotenv from "dotenv"

// SERVERS
import app from "@/app/app"
import mongodbConnection from "@/connections/mongodb"
import { redisConnection } from "./connections/redis"
import { checkDB, postgresConnection } from "./connections/postgres"

// DOTENV CONFIGURATION
dotenv.config();

// HANDLE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err: any) => {
     console.error(`UNCAUGHT EXCEPTION: ${err.message}`);
     process.exit(1);
})

// START THE SERRVER
const runApp = async () => {
     try {
          // check if postgres db exists
          await checkDB();

          // start the connection with the postgres server
          await postgresConnection();

          // start the connection with mongo db
          await mongodbConnection();

          // start the connection with the redis server
          await redisConnection();

          // listen to the server
          app.listen(process.env.PORT, () => console.log("auth service is running"));
     } catch (error) {
          console.error(error);
     }
}

runApp();

// HANDLE UNHANDLED REJECTIONS
process.on("unhandledRejection", (err: any) => {
     console.error(`UNHANDLED REJECTION: ${err.message}`);
     process.exit(1);
})