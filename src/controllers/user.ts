import { Response, NextFunction } from "express";

// MODELS
import { userRepo } from "@/connections/postgres";

// UTILS
import i18n from "@/utils/i18n";
import catchAsync from "@/utils/catchAsync";
import ErrorHandler from "@/utils/errorHandler";
import PgApiFeatures from "@/utils/pgApiFeatures";

// TYPES & DTOs
import { CustomRequest } from "@/types/general/general";

// GET => /api/v1/users
export const getAllUsers = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // create a query from users table
     let query = userRepo.createQueryBuilder("users");

     // add query features params
     const features = new PgApiFeatures(query, req.query, "users")
          .filter().sort().search(["username", "firstname", "lastname", "email", "phone"]).limitFields().paginate();

     // update the query
     query = features.getQuery();

     // get params info
     const params = req.query;
     const rows = await userRepo.count();

     // get users
     const users = await query.getMany();

     res.status(200).json({ rows, ...params, results: users })
});