export const getMonthlyReport = async (req, res) => {
  try {
    // TODO: Generate monthly report
    res.send("Monthly report controller");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
