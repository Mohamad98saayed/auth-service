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
import { generateUniqueUsername } from "@/utils/utilities";

// TYPES & DTOs
import { CustomRequest } from "@/types/general";
import { LoginInputModel, CreateUserInputModel } from "@/dto/auth";

// POST => /api/v1/auth/login
export const login = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // extract data from body
     const { email, password } = req.body as LoginInputModel;

     // get user
     const user = await userRepo
          .createQueryBuilder("user")
          .leftJoinAndSelect("user.roleId", "role")
          .where("user.email = :email", { email })
          .getOne();


     // check if user exists
     if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404));

     // check if user account activated
     if (!user.isActive) return next(new ErrorHandler(i18n.__("user-not-active"), 403));

     // check if passwords mathces
     const isPasswordMatches = await user.comparePassword(password);
     if (!isPasswordMatches) return next(new ErrorHandler(i18n.__("something-wrong"), 400));

     // send response with token
     sendToken(user, 200, res);
});

// POST => /api/v1/auth/create-user
export const createUser = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // extract current logged in username
     const currentUser = req.user.username;

     // extract data from body
     const { firstname, lastname, email, password, phone, roleId } = req.body as CreateUserInputModel;

     // get role
     const role = await roleRepo
          .createQueryBuilder("role")
          .where("role.id = :id", { id: roleId })
          .getOne();

     // check if role exists
     if (!role) return next(new ErrorHandler(i18n.__("role-not-found"), 404));

     // get privleges documents
     const rolePrivlegesDocument = await privlegesTemplate.findById(role.privlegesTemplateId);

     // check if privliges document exists
     if (!rolePrivlegesDocument) return next(new ErrorHandler(i18n.__("privleges-template-not-found"), 404));

     // create a privleges document for the user
     const userPrivlegesDocument = await privleges.create({
          canViewUsers: rolePrivlegesDocument.canViewUsers,
          canWriteUsers: rolePrivlegesDocument.canWriteUsers,
     });

     // generate username
     const username = generateUniqueUsername(firstname, lastname);

     try {
          // create the user
          const user = await userRepo.create({
               firstname, lastname, email, password, phone, username, privlegesId: userPrivlegesDocument.id, createdBy: currentUser, roleId: role
          }).save();

          // TODO: send activation link
          const emailVerificationToken = await user.getEmailVerificationToken();

          res.status(201).json({ emailVerificationToken, user })
     } catch (error: any) {
          // delete created privleges document
          if (userPrivlegesDocument._id) await privleges.deleteOne(userPrivlegesDocument._id);

          // throw error so error middleware can handle this error
          throw error;
     }
});

// GET => /api/v1/auth/current-user
export const getCurrentUser = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // get user
     const user = await userRepo
          .createQueryBuilder("user")
          .leftJoinAndSelect("user.roleId", "role")
          .where("user.id = :id", { id: req.user.id })
          .getOne();

     // check if user exists
     if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404));

     res.status(200).json({ user, privleges: req.privleges });
});

// GET => /api/v1/auth/forget-password
export const forgetPassword = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // get email from body
     const { email } = req.body as { email: string };

     // get user
     const user = await userRepo
          .createQueryBuilder("user")
          .where("user.email = :email", { email })
          .getOne();

     // check if user with this email exists
     if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404));

     // check if user is active
     if (!user.isActive) return next(new ErrorHandler(i18n.__("user-not-active"), 403));

     // generate a reset token
     const token = await user.getPasswordResetToken();

     // TODO: notify by email

     res.status(200).json({ token });
})

// PUT => /api/v1/auth/reset-password/:token
export const resetPassword = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // get token from params
     const { token } = req.params as { token: string };

     // find user with this token
     const user = await userRepo
          .createQueryBuilder("user")
          .where("user.passwordResetToken = :token", { token })
          .getOne();

     // check if user exists
     if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404));

     // check if expiry date is still valid
     const now = new Date(Date.now()).getTime();
     const isTokenValid = user.passwordResetTokenExpiry.getTime() > now;
     if (!isTokenValid) return next(new ErrorHandler(i18n.__("reset-token-expired"), 400))

     // get password from body
     const { password } = req.body as { password: string };

     // update user
     user.password = password;
     user.passwordResetToken = null!;
     user.passwordResetTokenExpiry = null!;

     // save changes
     await user.save();

     res.status(200).json({});
})

// PUT => /api/v1/auth/email-verification/:token
export const emailVerification = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // get token from params
     const { token } = req.params as { token: string };

     // find user with this token
     const user = await userRepo
          .createQueryBuilder("user")
          .where("user.emailVerificationToken = :token", { token })
          .getOne();

     // check if user exists
     if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404));

     // check if user has email verification token
     if (!user.emailVerificationToken) return next(new ErrorHandler(i18n.__("user-verified"), 400));

     // update user active status
     user.isActive = true;
     user.emailVerificationToken = null!;

     // save changes
     await user.save({ listeners: false });

     res.status(200).json(user);
})