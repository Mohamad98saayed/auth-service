import express from "express";

// CONTROLLER
import { login, createUser, getCurrentUser } from "@/controllers/auth";

// MIDDLEWARES
import dto from "@/middlewares/dto";
import { isAuthenticated, isAuthorized } from "@/middlewares/auth";

// DTO
import { LoginInputModel, CreateUserInputModel } from "@/dto/auth";

// CREATE THE ROUTER
const router = express.Router();

// ENDPOINTS
router.post("/login", dto(LoginInputModel), login);
router.post("/create-user", isAuthenticated, isAuthorized("canWriteUsers"), dto(CreateUserInputModel), createUser);
router.get("/current-user", isAuthenticated, getCurrentUser);

export default router;