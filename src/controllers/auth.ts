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

     // check if passwords mathces
     const isPasswordMatches = await user.comparePassword(password);
     if (!isPasswordMatches) return next(new ErrorHandler(i18n.__("something-wrong"), 400));

     // check if user account activated
     if (!user.isActive) return next(new ErrorHandler(i18n.__("user-not-active"), 403))

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

          res.status(201).json({ user })
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