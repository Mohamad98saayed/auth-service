import { Schema, model } from "mongoose";

// TYPES
import { PrivlegesSchema } from "@/types/models/privleges";

const privlegeSchema = new Schema<PrivlegesSchema>({
     canLogin: {
          type: Boolean,
          default: false,
     },
     canForgetPassword: {
          type: Boolean,
          default: false,
     },
     canResetPassword: {
          type: Boolean,
          default: false,
     },
     canUpdatePassword: {
          type: Boolean,
          default: false,
     },
     canUpdateProfile: {
          type: Boolean,
          default: false,
     },
     canViewUsers: {
          type: Boolean,
          default: false,
     },
     canWriteUsers: {
          type: Boolean,
          default: false,
     },
})

export default model("Privleges", privlegeSchema);