import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";

// MODELS
import { userRepo } from "@/connections/postgres";
import privlegesModel from "@/models/mongodb/privleges";

// UTILS
import i18n from "./i18n";
import catchAsync from "@/utils/catchAsync";
import ErrorHandler from "@/utils/errorHandler";

// TYPES
import { CustomRequest } from "@/types/general/general";
import { PrivlegesSchema } from "@/types/models/privleges";

// CHECKS IF USER IS LOGGED IN
export const isAuthenticated = catchAsync(async (req: CustomRequest, _res: Response, next: NextFunction) => {
     // extract token from cookies
     const { token } = req.cookies;
     if (!token) return next(new ErrorHandler(i18n.__("user-not-auth"), 401));

     // check if token still valid
     const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;

     // if valid check if user with the saved id exists
     const user = await userRepo.findOne({ where: { id: decodedToken.id } });
     if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404));

     // get user privleges document
     const privlegesDoc = await privlegesModel.findOne({ where: { userId: user.id } });
     if (!privlegesDoc) return next(new ErrorHandler(i18n.__("privleges-doc-not-found"), 404));

     // save the user info in the req
     req.user = user;
     req.privleges = privlegesDoc;

     next();
});

// CHECK IF USER IS AUTHORIZED
export const isAuthorized = <K extends keyof PrivlegesSchema>(action: K) =>
     catchAsync(async (req: CustomRequest, _res: Response, next: NextFunction) => {
          // extract the corresponding authorization value of the action
          const hasAuthority = req.privleges[action];

          // return if user is forbidden to perform this action
          if (!hasAuthority) return next(new ErrorHandler(i18n.__("user-forbidden"), 403));

          next();
     });
