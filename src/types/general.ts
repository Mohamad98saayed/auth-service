import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

// MODEL
import { User } from "@/models/postgres/user";
import { PrivlegesSchema } from "./models/privleges";

export interface CustomRequest extends Request {
     user: User;
     privleges: PrivlegesSchema;
}

export interface CustomJWTPayload extends JwtPayload {
     id: string;
}

export interface GetAllBaseResponse<T> {
     rows: number
     page: number | null
     limit: number | null
     search: string | null
     sort: string | null
     order: string | null
     data: T[]
}