import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import budgetRoutes from "./routes/budget.js";
import expenseRoutes from "./routes/expense.js";
import { sql } from "./config/db.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(res.getHeaders());
})
app.get("/test", (req, res) => {
  res.send("hey");
})

app.use(cors());
app.use(express.json());
app.use(helmet()); // helmet	- Security -	Sets secure HTTP headers to protect your app
app.use(morgan("dev")); //Logging- Shows request details in terminal for debugging
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/budget', authMiddleware, budgetRoutes);
app.use('/api/expense', authMiddleware, expenseRoutes);

async function initDB() {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    // Budgets table
    await sql`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        month DATE NOT NULL,
        income DECIMAL(10, 2) NOT NULL,
        budget_amount DECIMAL(10, 2) NOT NULL,
        rules_json JSONB
      );
    `;

    // Income table
    await sql`
      CREATE TABLE IF NOT EXISTS income (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        note TEXT
      );
    `;

    // Expenses table
    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        budget_id INT NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        note TEXT
      );
    `;

    // Goals table
    await sql`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        target_amount DECIMAL(10, 2) NOT NULL,
        saved_amount DECIMAL(10, 2) DEFAULT 0,
        deadline DATE,
        note TEXT
      );
    `;
    console.log("Database initialized");
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
}

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})