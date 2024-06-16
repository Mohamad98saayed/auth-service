import { Schema, model } from "mongoose";

const privlegeSchema = new Schema({
     userId: {
          type: String,
          require: [true, "user id is required"]
     }
})

export default model("Privleges", privlegeSchema);