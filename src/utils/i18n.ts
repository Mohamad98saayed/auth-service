import path from "path";
import { I18n } from "i18n";

const i18n = new I18n({
     syncFiles: true,
     autoReload: true,
     objectNotation: true,
     defaultLocale: "en",
     locales: ["en", "ar"],
     queryParameter: "locale",
     directory: path.join("src", "public", "locales"),
})

export default i18n;