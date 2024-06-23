import { Schema, model } from "mongoose";

// TYPES
import { PrivlegesSchema } from "@/types/models/privleges";

const privlegeSchema = new Schema<PrivlegesSchema>({
     userId: {
          type: String,
          require: [true, "user id is required"]
     },
})

export default model("Privleges", privlegeSchema);