import { Response, NextFunction } from "express";

// MODELS
import privleges from "@/models/mongodb/privleges";
import { roleRepo, userRepo } from "@/connections/postgres";
import privlegesTemplate from "@/models/mongodb/privlegesTemplate";

// MIDDLEWARES
import i18n from "@/utils/i18n";

// UTILS
import { sendToken } from "@/utils/jwt";
import catchAsync from "@/utils/catchAsync";
import ErrorHandler from "@/utils/errorHandler";
import { generateUniqueUsername, parseDuplicateKeyError } from "@/utils/utilities";

// TYPES & DTOs
import { CustomRequest } from "@/types/general/general";
import { LoginInputModel, CreateUserInputModel } from "@/dto/auth";

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

// POST => /api/v1/auth/create-user
export const createUser = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // extract current logged in username
     const currentUser = req.user.username;

     // extract data from body
     const { firstname, lastname, email, password, phone, roleId } = req.body as CreateUserInputModel;

     // check for role id
     const role = await roleRepo.findOneBy({ id: roleId });
     if (!role) return next(new ErrorHandler(i18n.__("role-not-found"), 404));

     // get privleges documents
     const rolePrivlegesDocument = await privlegesTemplate.findById(role.privlegesTemplateId);
     if (!rolePrivlegesDocument) return next(new ErrorHandler(i18n.__("privleges-template-not-found"), 404));

     // create a privleges document for the user
     const userPrivlegesDocument = await privleges.create({
          canLogin: rolePrivlegesDocument.canLogin,
          canForgetPassword: rolePrivlegesDocument.canForgetPassword,
          canResetPassword: rolePrivlegesDocument.canResetPassword,
          canUpdatePassword: rolePrivlegesDocument.canUpdatePassword,
          canUpdateProfile: rolePrivlegesDocument.canUpdateProfile,
          canViewUsers: rolePrivlegesDocument.canViewUsers,
          canWriteUsers: rolePrivlegesDocument.canWriteUsers,
     });

     // generate username
     const username = generateUniqueUsername(firstname, lastname);

     try {
          // create the user
          const user = await userRepo.create({
               firstname, lastname, email, password, phone, username, privlegesId: userPrivlegesDocument.id, createdBy: currentUser
          }).save();

          res.status(201).json({ success: true, user })
     } catch (error: any) {
          // delete created privleges document
          await privleges.deleteOne(userPrivlegesDocument._id);

          // check if error is duplicate key violation
          if (error.code === "23505") {
               const duplicateError = parseDuplicateKeyError(error);
               const message = i18n.__(`(${duplicateError.key})-(VALUE)-duplicate-error`).replace('VALUE', duplicateError.value);
               return next(new ErrorHandler(message, 404));
          }

          return next(new ErrorHandler(i18n.__("something-wrong"), 404));
     }

})

/*
1 - login
2 - register
3 - forget password
4 - reset password
5 - activate account by email
6 - get logged in user
*/