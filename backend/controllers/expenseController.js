import { sql } from "../config/db.js";

// GET all expenses for a budget
export const getExpenses = async (req, res) => {
  const { budgetId } = req.params;

  try {
    const expenses = await sql`
      SELECT * FROM expenses WHERE budget_id = ${budgetId};
    `;
    res.json(expenses);
  } catch (err) {
    console.error("Error in getExpenses:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE expense
export const createExpense = async (req, res) => {
  const { budgetId } = req.params;
  const { title, amount } = req.body;

  try {
    const result = await sql`
      INSERT INTO expenses (budget_id, title, amount)
      VALUES (${budgetId}, ${title}, ${amount})
      RETURNING *;
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    console.error("Error in createExpense:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE expense
export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    await sql`DELETE FROM expenses WHERE id = ${id};`;
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Error in deleteExpense:", err);
    res.status(500).json({ error: "Server error" });
  }
};
