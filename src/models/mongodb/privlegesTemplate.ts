import { Schema, model } from "mongoose";

const privlegeTemplateSchema = new Schema({
     roleId: {
          type: String,
          require: [true, "user id is required"]
     }
})

export default model("PrivlegeTemplates", privlegeTemplateSchema);