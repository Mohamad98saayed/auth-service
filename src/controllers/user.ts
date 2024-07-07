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
     // allowed search fields
     const searchFields = ["username", "firstname", "lastname", "email", "phone"];

     // create a query from users table
     const query = userRepo.createQueryBuilder("u")
          .leftJoinAndSelect("u.roleId", "r")

     // add query features params
     const apiFeatures = new PgApiFeatures(query, req.query, "u")
          .filter().sort().search(searchFields).paginate().getQuery();

     // prepare the response info
     const params = req.query;
     const rows = await userRepo.count();
     const users = await apiFeatures.getMany();

     res.status(200).json({ rows, ...params, results: users })
});