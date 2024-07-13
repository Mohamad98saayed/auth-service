import { Response, NextFunction } from "express";

// MODELS
import { Role } from "@/models/postgres/role";
import { roleRepo } from "@/connections/postgres";

// UTILS
import i18n from "@/utils/i18n";
import catchAsync from "@/utils/catchAsync";
import ErrorHandler from "@/utils/errorHandler";
import PgApiFeatures from "@/utils/pgApiFeatures";

// TYPES & DTOs
import { CustomRequest, CustomeGetAllRequest, CustomeGetAllResponse } from "@/types/general";

// GET => /api/v1/roles
export const getAllRoles = catchAsync(async (req: CustomeGetAllRequest, res: Response, next: NextFunction) => {
     // extract query params from request
     const { page, fields, limit, order, search, sort } = req.query;

     // allowed search fields
     const searchFields = ["name"];

     // create a query from roles table
     const query = roleRepo.createQueryBuilder("role");

     // add api features to the current query
     const apiFeatures = new PgApiFeatures(query, req.query, "role")
          .filter()
          .sort()
          .search(searchFields)
          .paginate()
          .limitFields()
          .getQuery();

     // get user count
     const rows = await roleRepo.count();

     // get the data
     const data = await apiFeatures.getMany();

     // prepare the response object
     const response: CustomeGetAllResponse<Role> = {
          page: page || null,
          limit: limit || null,
          sort: sort || null,
          order: order || null,
          search: search || null,
          fields: fields || null,
          rows,
          data,
     }

     res.status(200).json(response)
});

// GET => /api/v1/roles/:id
export const getOneRole = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // get role
     const role = await roleRepo
          .createQueryBuilder("role")
          .where("role.id = :id", { id: req.params.id })
          .getOne()

     // check if role exists
     if (!role) return next(new ErrorHandler(i18n.__("role-not-found"), 404))

     res.status(200).json(role)
});