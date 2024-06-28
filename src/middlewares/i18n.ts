import { Request, Response, NextFunction } from "express";

// UTILS
import i18n from "@/utils/i18n";
import catchAsync from "@/utils/catchAsync";

// AUTOMATICALLY CHANGE LOCALE MIDDLEWARE
const setLocale = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
     const locale = req.headers["accept-language"] || "en";
     i18n.setLocale(locale);
     next()
})

export default setLocale