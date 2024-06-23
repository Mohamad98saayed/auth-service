import { Request } from "express";

// MODEL
import { User } from "@/models/postgres/user";
import { PrivlegesSchema } from "../models/privleges";

export interface CustomRequest extends Request {
     user: User;
     privleges: PrivlegesSchema;
}