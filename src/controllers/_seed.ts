import dotenv from "dotenv";

// MODELS
import privleges from "@/models/mongodb/privleges";
import { userRepo, roleRepo } from "@/connections/postgres";
import privlegesTemplate from "@/models/mongodb/privlegesTemplate";

/* DOTENV CONFIGURATION */
dotenv.config();

export const seedSupperUser = async () => {
     try {
          // check if supper user already exists
          const checkIfSupperAdminExists = await userRepo.findOne({ where: { username: process.env.USER_NAME } });

          // return if admin already seeded
          if (checkIfSupperAdminExists) return console.log("admin is already seeded")

          // create role privleges template
          const privlegeTemplate = await privlegesTemplate.create({
               canViewUsers: true,
               canWriteUsers: true,
          });

          // create role
          const role = await roleRepo.create({
               name: process.env.ROLE_NAME,
               privlegesTemplateId: privlegeTemplate.id,
               createdBy: process.env.SYSTEM_NAME
          }).save();

          // create privleges document
          const privlegesDocument = await privleges.create({
               canViewUsers: privlegeTemplate.canViewUsers,
               canWriteUsers: privlegeTemplate.canWriteUsers
          });

          // create supper user
          await userRepo.create({
               firstname: process.env.FIRST_NAME,
               lastname: process.env.LAST_NAME,
               username: process.env.USER_NAME,
               phone: process.env.PHONE,
               email: process.env.EMAIL,
               password: process.env.PASSWORD,
               roleId: role,
               isActive: true,
               privlegesId: privlegesDocument.id,
               createdBy: process.env.SYSTEM_NAME
          }).save();

     } catch (error) {
          console.error(error)
     }
}