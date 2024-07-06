import express from "express";

// CONTROLLER
import { getAllUsers } from "@/controllers/user";

// MIDDLEWARES
import { isAuthenticated, isAuthorized } from "@/middlewares/auth";

// CREATE THE ROUTER
const router = express.Router();

// ENDPOINTS
router.get("/", isAuthenticated, isAuthorized("canViewUsers"), getAllUsers)

export default router;