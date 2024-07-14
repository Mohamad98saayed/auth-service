import express from "express";

// CONTROLLER
import { login, createUser, getCurrentUser, forgetPassword, resetPassword, emailVerification } from "@/controllers/auth";

// MIDDLEWARES
import dto from "@/middlewares/dto";
import { isAuthenticated, isAuthorized } from "@/middlewares/auth";

// DTO
import { LoginInputModel, CreateUserInputModel, ForgetPasswordInputModule, ResetPasswordInputModule } from "@/dto/auth";

// CREATE THE ROUTER
const router = express.Router();

// ENDPOINTS
router.post("/login", dto(LoginInputModel), login);
router.post("/create-user", isAuthenticated, isAuthorized("canWriteUsers"), dto(CreateUserInputModel), createUser);
router.get("/current-user", isAuthenticated, isAuthorized("canViewUsers"), getCurrentUser);
router.get("/forget-password", dto(ForgetPasswordInputModule), forgetPassword);
router.put("/reset-password/:token", dto(ResetPasswordInputModule), resetPassword);
router.put("/email-verification/:token", emailVerification)

export default router;