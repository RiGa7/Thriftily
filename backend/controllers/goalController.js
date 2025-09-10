export const getGoals = async (req, res) => {
  try {
    // TODO: Fetch saving goals
    res.send("Get goals controller");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createGoal = async (req, res) => {
  try {
    // TODO: Create new saving goal
    res.send("Create goal controller");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    // TODO: Update goal by ID
    res.send("Update goal controller");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    // TODO: Delete goal by ID
    res.send("Delete goal controller");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
