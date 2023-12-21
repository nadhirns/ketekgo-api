import express from "express";
import { getTransaction, getTransactionById, createTransaction, updateTransaction, deleteTransaction, driverTransaction, confirmTransaction, userTransaction } from "../controllers/transaction_controller.js";
import { verifyUser, adminOnly } from "../middleware/auth_mid_user.js";

const router = express.Router();
// Admin
router.get("/trans", verifyUser, getTransaction);
router.get("/trans/:id", verifyUser, adminOnly, getTransactionById);
router.patch("/trans/:id", verifyUser, adminOnly, updateTransaction);
router.delete("/trans/:id", verifyUser, adminOnly, deleteTransaction);
// User
router.post("/trans", verifyUser, createTransaction);
router.get("/transUser", verifyUser, userTransaction);
// Driver
router.get("/transDriver", verifyUser, driverTransaction);
router.patch("/transDriver/:id", verifyUser, confirmTransaction);

export default router;
