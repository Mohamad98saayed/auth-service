import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express"

// UTILS
import i18n from "@/utils/i18n";
import ErrorHandler from "@/utils/errorHandler";
import { parseDuplicateKeyError } from "@/utils/utilities";

// DOTENV CONFIGURATION 
dotenv.config();

// ERROR MIDDLEWARE THAT REFORMATS ERRORS INTO JSON FORMAT
export default (err: any, _req: Request, res: Response, _next: NextFunction) => {
     err.statusCode = err.statusCode || 500;

     if (err.code === "23505") {
          const duplicateError = parseDuplicateKeyError(err);
          const message = i18n.__(`(${duplicateError.key})-(VALUE)-duplicate-error`).replace('VALUE', duplicateError.value);
          err = new ErrorHandler(message, 404);
     }

     res.status(err.statusCode).json({
          message: err.message,
          stack: err.stack,
     });
};