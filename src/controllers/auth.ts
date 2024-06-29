import { Response, NextFunction } from "express";

// MODELS
import { userRepo } from "@/connections/postgres";

// MIDDLEWARES
import i18n from "@/utils/i18n";

// UTILS
import { sendToken } from "@/utils/jwt";
import catchAsync from "@/utils/catchAsync";
import ErrorHandler from "@/utils/errorHandler";

// TYPES & DTOs
import { LoginInputModel } from "@/dto/auth";
import { CustomRequest } from "@/types/general/general";

// POST => /api/v1/auth/login
export const login = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // extract data from body
     const { email, password } = req.body as LoginInputModel;

     // check if user with this email exists
     const user = await userRepo.findOne({ where: { email }, select: ["id", "password", "privlegesId"] })
     if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404));

     // check if passwords mathces
     const isPasswordMatches = await user.comparePassword(password);
     if (!isPasswordMatches) return next(new ErrorHandler(i18n.__("something-wrong"), 400));

     // remove password before response
     user.password = undefined as never;

     // send response with token
     sendToken(user, 200, res);
});

/*
1 - login
2 - register
3 - forget password
4 - reset password
5 - activate account by email
6 - get logged in user
*/