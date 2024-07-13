import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

// MODEL
import { User } from "@/models/postgres/user";
import { PrivlegesSchema } from "./models/privleges";

// custome request
export interface CustomRequest extends Request {
     user: User;
     privleges: PrivlegesSchema;
}

// custome get all request
export interface CustomeGetAllRequest extends CustomRequest {
     query: {
          page?: string
          limit?: string
          search?: string
          sort?: string
          order?: string
          fields?: string
     }
}

// custome get all response
export interface CustomeGetAllResponse<T> {
     page: string | null
     limit: string | null
     search: string | null
     sort: string | null
     order: string | null
     fields: string | null
     rows: number
     data: T[]
}


// custom JWT response
export interface CustomJWTPayload extends JwtPayload {
     id: string;
}