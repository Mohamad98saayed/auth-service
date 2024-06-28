import dotenv from "dotenv"
import { createClient } from 'redis'

// DOTENV CONFIGURATION
dotenv.config();

// REDIS SERVER
export const redisServer = createClient({
     url: process.env.REDIS_URL,
     username: process.env.REDIS_USER,
     password: process.env.REDIS_PASS
}).on("error", (error) => console.log(error))

// REDIS CONNECTION
export const redisConnection = async () => {
     try {
          await redisServer.connect();
          console.log("Redis server connected");
     } catch (error) {
          console.error("Error connecting to Redis server:", error);
     }
};