import express from "express";

// CONTROLLER
import { login } from "@/controllers/auth";

// MIDDLEWARES
import dto from "@/middlewares/dto";

// DTO
import { LoginInputModel } from "@/dto/auth";

// CREATE THE ROUTER
const router = express.Router();

// ENDPOINTS
router.post("/login", dto(LoginInputModel), login);

export default router;