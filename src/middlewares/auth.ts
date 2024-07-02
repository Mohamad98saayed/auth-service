import { Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

// MODELS
import { userRepo } from "@/connections/postgres";
import privlegesModel from "@/models/mongodb/privleges";

// UTILS
import i18n from "@/utils/i18n";
import { sendToken } from "@/utils/jwt";
import catchAsync from "@/utils/catchAsync";
import ErrorHandler from "@/utils/errorHandler";

// TYPES
import { CustomRequest } from "@/types/general/general";
import { PrivlegesSchema } from "@/types/models/privleges";
import { CustomJWTPayload } from "@/types/general/general";

// CHECKS IF USER IS LOGGED IN
export const isAuthenticated = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // extract token from cookies
     const { token } = req.cookies;
     if (!token) return next(new ErrorHandler(i18n.__("user-not-auth"), 401));

     try {
          // check if token still valid
          const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as CustomJWTPayload;

          // if valid check if user with the saved id exists
          const user = await userRepo.findOne({ where: { id: decodedToken.id }, select: ["id", "privlegesId", "username"] })
          if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404));

          // get user privleges document
          const privlegesDoc = await privlegesModel.findById(user.privlegesId);
          if (!privlegesDoc) return next(new ErrorHandler(i18n.__("privleges-doc-not-found"), 404));

          // save the user info in the req
          req.user = user;
          req.privleges = privlegesDoc;

          next();
     } catch (error) {
          // check if error is because of the expiring of token
          if (error instanceof TokenExpiredError) {
               // decode token 
               const decodedToken = jwt.decode(token) as CustomJWTPayload;

               // check user existance
               const user = await userRepo.findOne({ where: { id: decodedToken.id }, select: ["id", "privlegesId", "username"] })
               if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404));

               // send a new token 
               sendToken(user, 200, res)
          } else {
               return next(new ErrorHandler(i18n.__("something-wrong"), 400));
          }
     }
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
