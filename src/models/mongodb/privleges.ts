import { Schema, model } from "mongoose";

// TYPES
import { PrivlegesSchema } from "@/types/models/privleges";

const privlegeSchema = new Schema<PrivlegesSchema>({
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