import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express"

/* ERROR HANDLER CLASS */
import ErrorHandler from "@/utils/errorHandler";

/* DOTENV CONFIGURATION */
dotenv.config();

/* ERROR MIDDLEWARE THAT REFORMATS ERRORS INTO JSON FORMAT */
export default (err: ErrorHandler, _req: Request, res: Response, _next: NextFunction) => {
     err.statusCode = err.statusCode || 500;

     res.status(err.statusCode).json({
          success: false,
          message: err.message,
          stack: err.stack,
     });
};