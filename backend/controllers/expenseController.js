import { sql } from "../config/db.js";

export const getExpenses = async (req, res) => {
  try {
    const expenses = await sql`
      SELECT * FROM expenses 
      WHERE user_id = ${req.user.id}
      ORDER BY date DESC;
    `;
    res.json(expenses);
  } catch (err) {
    console.error("Error in getExpenses:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getExpenseById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`
      SELECT * FROM expenses 
      WHERE id = ${id} AND user_id = ${req.user.id};
    `;
    if (result.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Error in getExpenseById:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createExpense = async (req, res) => {
  const { budget_id, title, amount, category, date, note } = req.body;
  try {
    const result = await sql`
      INSERT INTO expenses (user_id, budget_id, title, amount, category, date, note)
      VALUES (${req.user.id}, ${budget_id}, ${title}, ${amount}, ${category}, ${date || new Date()}, ${note || null})
      RETURNING *;
    `;
    res.status(201).json({ message: "Expense created", expense: result[0] });
  } catch (err) {
    console.error("Error in createExpense:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date, note } = req.body;
  try {
    const result = await sql`
      UPDATE expenses
      SET title = ${title}, amount = ${amount}, category = ${category}, date = ${date}, note = ${note}
      WHERE id = ${id} AND user_id = ${req.user.id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({ message: "Expense not found or not yours" });
    }
    res.json({ message: "Expense updated", expense: result[0] });
  } catch (err) {
    console.error("Error in updateExpense:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`
      DELETE FROM expenses
      WHERE id = ${id} AND user_id = ${req.user.id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({ message: "Expense not found or not yours" });
    }
    res.json({ message: "Expense deleted", expense: result[0] });
  } catch (err) {
    console.error("Error in deleteExpense:", err);
    res.status(500).json({ error: "Server error" });
  }
};
