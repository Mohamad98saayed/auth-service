import dotenv from "dotenv";
import { Response, NextFunction } from "express";

// MODELS
import { User } from "@/models/postgres/user";
import { userRepo } from "@/connections/postgres";

// UTILS
import i18n from "@/utils/i18n";
import catchAsync from "@/utils/catchAsync";
import ErrorHandler from "@/utils/errorHandler";
import PgApiFeatures from "@/utils/pgApiFeatures";

// TYPES & DTOs
import { UpdatePasswordInputModule, UpdateUserDetailsInputModel } from "@/dto/user";
import { CustomRequest, CustomeGetAllRequest, CustomeGetAllResponse } from "@/types/general";

// DOTENV CONFIGURATION
dotenv.config();

// GET => /api/v1/users
export const getAllUsers = catchAsync(async (req: CustomeGetAllRequest, res: Response, next: NextFunction) => {
     // extract query params from request
     const { page, fields, limit, order, search, sort } = req.query;

     // allowed search fields
     const searchFields = ["username", "firstname", "lastname", "email", "phone"];

     // create a query from users table & include role
     const query = userRepo
          .createQueryBuilder("user")
          .leftJoinAndSelect("user.roleId", "role");

     // add api features to the current query
     const apiFeatures = new PgApiFeatures(query, req.query, "user")
          .filter()
          .sort()
          .search(searchFields)
          .paginate()
          .limitFields()
          .getQuery();

     // get user count
     const rows = await userRepo.count();

     // get the data
     const data = await apiFeatures.getMany();

     // prepare the response object
     const response: CustomeGetAllResponse<User> = {
          page: page || null,
          limit: limit || null,
          sort: sort || null,
          order: order || null,
          search: search || null,
          fields: fields || null,
          rows,
          data,
     }

     res.status(200).json(response);
});

// GET => /api/v1/users/:id
export const getOneUser = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // get user
     const user = await userRepo
          .createQueryBuilder("user")
          .leftJoinAndSelect("user.roleId", "role")
          .where("user.id = :id", { id: req.params.id })
          .getOne();

     // check if user exists
     if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404))

     res.status(200).json(user);
});

// PUT /api/v1/users/avatar
export const updateAvatar = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => { });

// PUT /api/v1/users/password
export const updatePassword = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // define the current user
     const { user } = req;

     // get passwords from req body
     const { newPassword, oldPassword } = req.body as UpdatePasswordInputModule;

     // check if old password is correct
     const isPasswordMatches = await user.comparePassword(oldPassword);
     if (!isPasswordMatches) return next(new ErrorHandler(i18n.__("something-wrong"), 400));

     // update password
     user.password = newPassword;
     user.updatedBy = user.username;

     // save changes
     await user.save();

     res.status(200).json({ message: i18n.__("password-updated") });
});

// PUT /api/v1/users/details
export const updateDetails = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // define the current user
     const { user } = req;

     // get user's details from body
     const { firstname, lastname, email, phone } = req.body as UpdateUserDetailsInputModel;

     // check if email changed
     const isEmailChanged = email !== user.email;

     // when email is changed deactivate user's acount
     if (isEmailChanged) {
          user.isActive = false;
          user.email = email;
     }

     // update details
     user.firstname = firstname;
     user.lastname = lastname;
     user.phone = phone;
     user.updatedBy = user.username;

     // save changes
     await user.save({ listeners: false });

     // return a response base on changes
     if (isEmailChanged) {
          // TODO: send new email verification
          res.status(200).cookie(process.env.COOKIE_NAME!, null).json({ message: i18n.__("email-changed-notification") });
     } else {
          res.status(200).json({ message: i18n.__("profile-updated") });
     }
});

// PUT /api/v1/users/deactivate-profile
export const deactivateProfile = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // define the current user
     const { user } = req;

     // update user 
     user.isActive = false;
     user.updatedBy = user.username;

     // save changes
     await user.save({ listeners: false });

     res.status(200).json({ message: i18n.__("account-deactivated") })
});

// PUT /api/v1/users/active/:id
export const updateActivity = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // get user id from params
     const { id } = req.params as { id: string };

     // get user
     const user = await userRepo
          .createQueryBuilder("user")
          .where("user.id = :id", { id })
          .getOne();

     // check if user exists
     if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404));

     // update user 
     user.isActive = !user.isActive;
     user.updatedBy = req.user.username;

     // save changes
     await user.save({ listeners: false });

     res.status(200).json({ message: i18n.__("active-status-updated") });
});

// PUT /api/v1/users/archive/:id
export const archiveUser = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // get user id from params
     const { id } = req.params as { id: string };

     // get user
     const user = await userRepo
          .createQueryBuilder("user")
          .where("user.id = :id", { id })
          .getOne();

     // check if user exists
     if (!user) return next(new ErrorHandler(i18n.__("user-not-found"), 404));

     // soft delete user
     await user.softRemove({ listeners: false });

     // update deleted by 
     user.deletedBy = req.user.username;

     // save changes
     await user.save({ listeners: false });

     res.status(200).json({ message: i18n.__("user-is-archived") });
});
