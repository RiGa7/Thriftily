import { sql } from "../config/db.js";

export const getUserProfile = async (req, res) => {
  try {
    const result = await sql`
      SELECT id, username, name, email, created_at
      FROM users
      WHERE id = ${req.user.id};
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user profile (name, email, username)
export const updateUserProfile = async (req, res) => {
  const { username, name, email } = req.body;

  try {
    const result = await sql`
      UPDATE users
      SET username = COALESCE(${username}, username),
          name = COALESCE(${name}, name),
          email = COALESCE(${email}, email)
      WHERE id = ${req.user.id}
      RETURNING id, username, name, email, created_at;
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated", user: result[0] });
  } catch (err) {
    console.error("Error in updateUserProfile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  try {
    const result = await sql`
      DELETE FROM users
      WHERE id = ${req.user.id}
      RETURNING id, username, email;
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User account deleted", user: result[0] });
  } catch (err) {
    console.error("Error in deleteUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};