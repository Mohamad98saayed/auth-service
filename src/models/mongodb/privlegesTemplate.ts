import { Schema, model } from "mongoose";

// TYPES
import { PrivlegesTemplateSchema } from "@/types/models/privlegesTemplate";

const privlegeTemplateSchema = new Schema<PrivlegesTemplateSchema>({
     roleId: {
          type: String,
          require: [true, "user id is required"]
     }
})

export default model("PrivlegeTemplates", privlegeTemplateSchema);