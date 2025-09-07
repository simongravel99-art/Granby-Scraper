import { pool } from "./db/pool.js";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

async function setup() {
  try {
    console.log("Setting up database...");
    
    // Read and execute init.sql
    const initSQL = readFileSync('./init.sql', 'utf8');
    await pool.query(initSQL);
    
    // Install Graphile Worker
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);
    
    console.log("✓ Database setup complete");
    console.log("✓ Graphile Worker tables created");
    
  } catch (error) {
    console.error("Setup error:", error);
  } finally {
    await pool.end();
  }
}

setup();
