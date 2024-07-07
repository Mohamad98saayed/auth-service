import express from "express";

// CONTROLLER
import { getAllRoles, getOneRole } from "@/controllers/roles";

// MIDDLEWARES
import { isAuthenticated, isAuthorized } from "@/middlewares/auth";

// CREATE THE ROUTER
const router = express.Router();

// ENDPOINTS
router.get("/", isAuthenticated, isAuthorized("canViewUsers"), getAllRoles);
router.get("/:id", isAuthenticated, isAuthorized("canViewUsers"), getOneRole);

export default router;