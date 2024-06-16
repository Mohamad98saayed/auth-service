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

// STARTS THE SERVER
app.listen(process.env.PORT, async () => {
     try {
          console.log(`application is running`);

          // connections
          await checkDB();
          await mongodbConnection();
          await postgresConnection();
          await redisConnection();
     } catch (error) {
          console.error(error)
     }
})

// HANDLE UNHANDLED REJECTIONS
process.on("unhandledRejection", (err: any) => {
     console.error(`UNHANDLED REJECTION: ${err.message}`);
     process.exit(1);
})