import express from "express";
import { getRoles, getRolesById, createRoles, updateRoles, deleteRoles } from "../controllers/role_controller.js";
import { verifyUser, adminOnly } from "../middleware/auth_mid_user.js";

const router = express.Router();

router.get("/roles", verifyUser, adminOnly, getRoles);
router.get("/roles/:id", verifyUser, adminOnly, getRolesById);
router.post("/roles", verifyUser, adminOnly, createRoles);
router.patch("/roles/:id", verifyUser, adminOnly, updateRoles);
router.delete("/roles/:id", verifyUser, adminOnly, deleteRoles);

export default router;
