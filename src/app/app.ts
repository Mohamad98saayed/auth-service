import hpp from "hpp";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";

// MIDDLEWARES
import setLocale from "@/middlewares/i18n";
import errorMiddleware from "@/middlewares/error";

// UTILS
import i18n from "@/utils/i18n";

// ROUTER
import authRouter from "@/routes/auth";
import userRouter from "@/routes/user";

// EXPRESS APP
const app = express();

// APP CONFIG
app.use(hpp());
app.use(cors());
app.use(helmet());
app.use(i18n.init);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: false }));

// LOCALE MIDDLEWARE
app.use(setLocale);

// APPEND ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// APPEND ERROR MIDDLEWARE
app.use(errorMiddleware);

export default app;