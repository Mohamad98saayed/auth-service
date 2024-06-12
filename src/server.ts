import app from "@/app/app"
import dotenv from "dotenv"

// DOTENV CONFIGURATION
dotenv.config();

// HANDLE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err: any) => {
     console.error(`UNCAUGHT EXCEPTION: ${err.message}`);
     process.exit(1);
})

// STARTS THE SERVER
app.listen(process.env.PORT, () => {
     console.info(`app running on port: ${process.env.PORT}`);
})

// HANDLE UNHANDLED REJECTIONS
process.on("unhandledRejection", (err: any) => {
     console.error(`UNHANDLED REJECTION: ${err.message}`);
     process.exit(1);
})