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
     redisServer
          .connect()
          .catch(error => console.error(error))
          .then(() => console.log("redis server connected"))
}
