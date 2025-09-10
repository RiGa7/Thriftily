export const getProfile = async (req, res) => {
  try {
    // TODO: Fetch logged-in user profile
    res.send("User profile controller");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // TODO: Update user profile
    res.send("Update profile controller");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
