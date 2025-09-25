import { sql } from "../config/db.js";

export const createBudget = async (req, res) => {
  const { month, income, budget_amount, rules_json } = req.body;

  try {
    const result = await sql`
      INSERT INTO budgets (user_id, month, income, budget_amount, rules_json)
      VALUES (${req.user.id}, ${month}, ${income}, ${budget_amount}, ${rules_json})
      RETURNING *;
    `;
    res.status(201).json({ message: "Budget created", budget: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const result = await sql`
      SELECT 
        b.id,b.user_id,b.month,b.income,b.budget_amount,b.rules_json,COALESCE(SUM(e.amount), 0) AS total_expenses
        FROM budgets b
        LEFT JOIN expenses e ON b.id = e.budget_id
        WHERE b.user_id = ${req.user.id}
        GROUP BY b.id
        ORDER BY b.month DESC;
    `;

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getBudgetById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch budget
    const budgetResult = await sql`
      SELECT * FROM budgets
      WHERE id = ${id} AND user_id = ${req.user.id};
    `;

    if (budgetResult.length === 0) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const budget = budgetResult[0];

    // Fetch expenses for this budget
    const expenses = await sql`
      SELECT * FROM expenses
      WHERE budget_id = ${id}
      ORDER BY date DESC;
    `;

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const remaining = Number(budget.budget_amount) - totalExpenses;

    res.json({
      ...budget,
      expenses,
      summary: {
        total_expenses: totalExpenses,
        remaining_budget: remaining,
      },
    });
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

    res.json({ message: "Budget updated", budget: result[0] });
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

    res.json({ message: "Budget deleted", budget: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};