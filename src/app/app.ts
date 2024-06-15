import hpp from "hpp"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import express from "express"
import i18n, { setLocale } from "@/middlewares/i18n"
import cookieParser from "cookie-parser"
import mongoSanitize from "express-mongo-sanitize"

// MIDDLEWARES
import errorMiddleware from "@/middlewares/error"

// EXPRESS APP
const app = express()

// APP CONFIG
app.use(hpp())
app.use(cors())
app.use(helmet())
app.use(i18n.init)
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use(mongoSanitize())
app.use(express.urlencoded({ extended: false }))

// LOCALE MIDDLEWARE
app.use(setLocale);

// APPEND ERROR MIDDLEWARE
app.use(errorMiddleware);

export default app;