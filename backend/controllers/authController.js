import { sql } from "../config/db.js";
import bcrypt from "bcrypt";  // for password hashing
import jwt from "jsonwebtoken";  // for login tokens

export const registerUser = async (req, res) => {
  const { username, name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await sql.query(
      "INSERT INTO users (username, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username, email",
      [username, name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await sql.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },  // payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logoutUser = (req, res) => {
  res.json({ message: "Logged out" });
};
