import { Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

// UTILS
import i18n from "@/utils/i18n";
import catchAsync from "@/utils/catchAsync";
import ErrorHandler from "@/utils/errorHandler";

// TYPES
import { CustomRequest } from "@/types/general";

// DTO VALIDATOR
const dto = (dto: any) =>
     catchAsync(async (req: CustomRequest, _res: Response, next: NextFunction) => {
          // check if req.body matches theh dto rules
          const errors = await validate(plainToInstance(dto, req.body))

          // refactore error messages
          if (errors.length > 0) {
               const errorMessage = Object.values(errors[0].constraints!)[0].replace(/ /g, "-");
               return next(new ErrorHandler(i18n.__(errorMessage), 400))
          }

          next()
     })

export default dto;