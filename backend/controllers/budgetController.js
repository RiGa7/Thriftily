import { sql } from "../config/db.js";

export const createBudget = async (req, res) => {
  const { month, income, budget_amount, rules_json } = req.body;

  try {
    const result = await sql`
      INSERT INTO budgets (user_id, month, income, budget_amount, rules_json)
      VALUES (${req.user.id}, ${month}, ${income}, ${budget_amount}, ${rules_json})
      RETURNING *;
    `;
    res.status(201).json({ message: "Budget created", budget: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM budgets
      WHERE user_id = ${req.user.id}
      ORDER BY month DESC;
    `;
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBudgetById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`
      SELECT * FROM budgets
      WHERE id = ${id} AND user_id = ${req.user.id};
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBudget = async (req, res) => {
  const { id } = req.params;
  const { month, income, budget_amount, rules_json } = req.body;
  try {
    const result = await sql`
      UPDATE budgets
      SET month = ${month}, income = ${income}, budget_amount = ${budget_amount}, rules_json = ${rules_json}
      WHERE id = ${id} AND user_id = ${req.user.id}
      RETURNING *;
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Budget not found or not yours" });
    }

    res.json({ message: "Budget updated", budget: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBudget = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`
      DELETE FROM budgets
      WHERE id = ${id} AND user_id = ${req.user.id}
      RETURNING *;
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Budget not found or not yours" });
    }

    res.json({ message: "Budget deleted", budget: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};