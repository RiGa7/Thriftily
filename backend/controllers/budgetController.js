import db from "../config/db.js";

export const getBudgets = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM budgets WHERE user_id=$1", [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBudget = async (req, res) => {
  const { category, amount } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO budgets (user_id, category, amount) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, category, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBudget = async (req, res) => {
  const { id } = req.params;
  const { category, amount } = req.body;
  try {
    const result = await db.query(
      "UPDATE budgets SET category=$1, amount=$2 WHERE id=$3 AND user_id=$4 RETURNING *",
      [category, amount, id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBudget = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM budgets WHERE id=$1 AND user_id=$2", [id, req.user.id]);
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
