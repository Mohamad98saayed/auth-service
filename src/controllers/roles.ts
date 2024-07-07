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
import { CustomRequest, GetAllBaseResponse } from "@/types/general";

// GET => /api/v1/roles
export const getAllRoles = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     // allowed search fields
     const searchFields = ["name"];

     // create a query from roles table
     const query = roleRepo.createQueryBuilder("r");

     // add api features to the current query
     const apiFeatures = new PgApiFeatures(query, req.query, "r").filter().sort().search(searchFields).paginate().getQuery();

     // prepare the response info
     const response: GetAllBaseResponse<Role> = {
          page: req.query?.page ? Number(req.query.page) : null,
          limit: req.query?.limit ? Number(req.query.limit) : null,
          sort: req.query?.sort ? String(req.query.sort) : null,
          order: req.query?.order ? String(req.query.order) : null,
          search: req.query.search ? String(req.query.search) : null,
          rows: await roleRepo.count(),
          data: await apiFeatures.getMany(),
     }

     res.status(200).json({ ...response })
})

// GET => /api/v1/roles/:id
export const getOneRole = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
     const role = await roleRepo.createQueryBuilder("r").where("r.id = :id", { id: req.params.id }).getOne()
     if (!role) return next(new ErrorHandler(i18n.__("role-not-found"), 404))
     res.status(200).json(role)
})