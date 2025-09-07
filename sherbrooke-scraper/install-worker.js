import pkg from "graphile-worker";
const { runMigrations } = pkg;
import { pool } from "./db/pool.js";

async function installWorker() {
  try {
    console.log("Installing Graphile Worker with proper migrations...");
    await runMigrations({ pgPool: pool });
    console.log("✓ Graphile Worker migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
  } finally {
    await pool.end();
  }
}

installWorker();
