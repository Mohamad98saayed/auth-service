import path from "path";
import { I18n } from "i18n";
import { Request, Response, NextFunction } from "express"

// UTILS
import catchAsync from "@/utils/catchAsync";

// CONFIGURATION
const i18n = new I18n({
     syncFiles: true,
     autoReload: true,
     objectNotation: true,
     defaultLocale: "en",
     locales: ["en", "ar"],
     queryParameter: "locale",
     directory: path.join("src", "public", "locales"),
})

// AUTOMATICALLY CHANGE LOCALY MIDDLEWARE
export const setLocale = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
     const locale = req.query.locale;

     if (locale && typeof locale === "string") {
          i18n.setLocale(locale);
     } else {
          i18n.setLocale("en");
     }

     next()
})

export default i18n