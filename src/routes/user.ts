import express from "express";

// CONTROLLER
import { getAllUsers, getOneUser, updatePassword, updateDetails, archiveUser, deactivateProfile, updateActivity } from "@/controllers/user";

// MIDDLEWARES
import dto from "@/middlewares/dto";
import { isAuthenticated, isAuthorized } from "@/middlewares/auth";

// DTO
import { UpdatePasswordInputModule, UpdateUserDetailsInputModel } from "@/dto/user";

// CREATE THE ROUTER
const router = express.Router();

// ENDPOINTS
router.get("/", isAuthenticated, isAuthorized("canViewUsers"), getAllUsers)
router.get("/:id", isAuthenticated, isAuthorized("canViewUsers"), getOneUser)
router.put("/password", isAuthenticated, isAuthorized("canViewUsers"), dto(UpdatePasswordInputModule), updatePassword)
router.put("/details", isAuthenticated, isAuthorized("canWriteUsers"), dto(UpdateUserDetailsInputModel), updateDetails)
router.put("/deactivate-profile", isAuthenticated, isAuthorized("canViewUsers"), deactivateProfile)
router.put("/active/:id", isAuthenticated, isAuthorized("canWriteUsers"), updateActivity)
router.put("/archive/:id", isAuthenticated, isAuthorized("canViewUsers"), archiveUser)

export default router;