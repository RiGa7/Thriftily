import express from "express";
import { getExpenses, createExpense, deleteExpense } from "../controllers/expenseController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/budget/:budgetId/expenses", getExpenses);
router.post("/budget/:budgetId/expenses", createExpense);
router.delete("/:id", deleteExpense);

export default router;