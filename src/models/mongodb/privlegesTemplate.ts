import { Schema, model } from "mongoose";

// TYPES
import { PrivlegesTemplateSchema } from "@/types/models/privlegesTemplate";

const privlegeTemplateSchema = new Schema<PrivlegesTemplateSchema>({
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

export default model("PrivlegeTemplates", privlegeTemplateSchema);