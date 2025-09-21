import { sql } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const registerUser = async (req, res) => {
  const { username, name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (username, name, email, password)
      VALUES (${username}, ${name}, ${email}, ${hashedPassword})
      RETURNING *;
    `;

    res.status(201).json({ message: "User registered", user: result[0] });
  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;

    const user = result[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGOUT
export const logoutUser = (req, res) => {
  res.json({ message: "Logged out" });
}; 
