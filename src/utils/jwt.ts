import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";

// MODELS
import { User } from "@/models/postgres/user";

// DOTENV CONFIGURATION
dotenv.config();

// CREATE JWT TOKEN
export const createToken = (id: string) => {
     return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
          expiresIn: process.env.JWT_EXPIRES
     })
}

// SEND TOKEN
export const sendToken = (user: User, statusCode: number, res: Response) => {
     const token = createToken(user.id);

     // cookie expires in
     const expiresInDate = Date.now() + Number(process.env.COOKIE_EXPIRES);

     // cookie options
     const cookieOptions: CookieOptions = {
          expires: new Date(expiresInDate),
          httpOnly: true,
          secure: false,
     }

     // secure cookie on production & staging
     if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging")
          cookieOptions.secure = true

     res.status(statusCode).cookie(process.env.COOKIE_NAME!, token, cookieOptions).json({
          token,
          user
     })
}