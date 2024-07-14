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
import { CustomRequest, CustomeGetAllRequest, CustomeGetAllResponse } from "@/types/general";

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
// PUT /api/v1/users/password
// PUT /api/v1/users/details
// PUT /api/v1/users/archive
// PUT /api/v1/users/active/:id