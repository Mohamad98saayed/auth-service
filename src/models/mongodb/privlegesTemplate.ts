import { Schema, model } from "mongoose";

// TYPES
import { PrivlegesTemplateSchema } from "@/types/models/privlegesTemplate";

const privlegeTemplateSchema = new Schema<PrivlegesTemplateSchema>({
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