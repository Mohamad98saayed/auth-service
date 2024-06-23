import { Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

// UTILS
import catchAsync from "@/utils/catchAsync";
import ErrorHandler from "@/utils/errorHandler";

// TYPES
import { CustomRequest } from "@/types/general/general";

// DTO VALIDATOR
export const dto = (dto: any) =>
     catchAsync(async (req: CustomRequest, _res: Response, next: NextFunction) => {
          // check if req.body matches theh dto rules
          const errors = await validate(plainToInstance(dto, req.body))

          // refactore error messages
          if (errors.length > 0) {
               let errorMessages = errors
                    .map((error: ValidationError) => Object.values(error?.constraints!))
                    .reduce((acc, curr) => acc.concat(curr), [])
                    .join(", ");

               return next(new ErrorHandler(errorMessages, 400))
          }

          next()
     })