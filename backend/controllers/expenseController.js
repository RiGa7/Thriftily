export const getExpenses = async (req, res) => {
  try {
    // TODO: Fetch all expenses
    res.send("Get all expenses controller");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    // TODO: Insert new expense
    res.send("Create expense controller");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    // TODO: Update expense by ID
    res.send("Update expense controller");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    // TODO: Delete expense by ID
    res.send("Delete expense controller");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
