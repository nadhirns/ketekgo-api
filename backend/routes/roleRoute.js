import express from "express";
import { getRoles, getRolesById, createRoles, updateRoles, deleteRoles } from "../controllers/role_controller.js";

const router = express.Router();

router.get('/roles', getRoles)
router.get('/roles/:id', getRolesById)
router.post('/roles', createRoles)
router.patch('/roles/:id', updateRoles)
router.delete('/roles/:id', deleteRoles)

export default router;
