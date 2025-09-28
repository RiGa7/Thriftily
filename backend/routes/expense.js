import express from "express";
import {getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", createExpense);        
router.get("/", getExpenses);           
router.get("/:id", getExpenseById);     
router.put("/:id", updateExpense);      
router.delete("/:id", deleteExpense);   

export default router;