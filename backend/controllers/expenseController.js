import { sql } from "../config/db.js";

// GET all expenses for a budget
export const getExpenses = async (req, res) => {
  const { budgetId } = req.params;

  try {
    const expenses = await sql`
      SELECT * FROM expenses 
      WHERE budget_id = ${budgetId} AND user_id = ${req.user.id}
      ORDER BY date DESC;
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
  const { title, amount, category, date, note } = req.body;

  try {
    const result = await sql`
      INSERT INTO expenses (user_id, budget_id, title, amount, category, date, note)
      VALUES (${req.user.id}, ${budgetId}, ${title}, ${amount}, ${category}, ${date || new Date()}, ${note || null})
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
