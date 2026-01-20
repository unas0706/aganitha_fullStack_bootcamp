import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({
  path: "C:/projects/aganitha/Postgresssql/.env",
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection(): Promise<void> {
  const result = await pool.query("SELECT 1");
  console.log("Connected at:", result);
  await pool.end();
}

testConnection();
