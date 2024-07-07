import { Response, NextFunction } from "express";

// MODELS
import { userRepo } from "@/connections/postgres";

// UTILS
import i18n from "@/utils/i18n";
import catchAsync from "@/utils/catchAsync";
import ErrorHandler from "@/utils/errorHandler";
import PgApiFeatures from "@/utils/pgApiFeatures";

// TYPES & DTOs
import { CustomRequest, GetAllBaseResponse } from "@/types/general/general";
import { User } from "@/models/postgres/user";

// GET => /api/v1/users
export const getAllUsers = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // allowed search fields
     const searchFields = ["username", "firstname", "lastname", "email", "phone"];

     // create a query from users table & include role
     const query = userRepo.createQueryBuilder("u").leftJoinAndSelect("u.roleId", "r")

     // add api features to the current query
     const apiFeatures = new PgApiFeatures(query, req.query, "u").filter().sort().search(searchFields).paginate().getQuery();

     // prepare the response info
     const response: GetAllBaseResponse<User> = {
          page: req.query?.page ? Number(req.query.page) : null,
          limit: req.query?.limit ? Number(req.query.limit) : null,
          sort: req.query?.sort ? String(req.query.sort) : null,
          order: req.query?.order ? String(req.query.order) : null,
          search: req.query.search ? String(req.query.search) : null,
          rows: await userRepo.count(),
          data: await apiFeatures.getMany(),
     }

     res.status(200).json({ ...response })
});