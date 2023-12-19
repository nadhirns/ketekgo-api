import express from "express";
import { getTransaction, getTransactionById, createTransaction, updateTransaction, deleteTransaction } from "../controllers/transaction_controller.js";

const router = express.Router();

router.get("/trans", getTransaction);
router.get("/trans/:id", getTransactionById);
router.post("/trans", createTransaction);
router.patch("/trans/:id", updateTransaction);
router.delete("/trans/:id", deleteTransaction);

export default router;
