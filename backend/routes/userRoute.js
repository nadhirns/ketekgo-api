import express from "express";
import { getUsers, getUsersById, createUsers, updateUsers, deleteUsers } from "../controllers/user_controller.js";
import { verifyUser, adminOnly } from "../middleware/auth_mid_user.js";

const router = express.Router();

router.get("/users", verifyUser, adminOnly, getUsers);
router.get("/users/:id", verifyUser, adminOnly, getUsersById);
router.patch("/users/:id", verifyUser, adminOnly, updateUsers);
router.delete("/users/:id", verifyUser, adminOnly, deleteUsers);

router.post("/register", createUsers);

export default router;
