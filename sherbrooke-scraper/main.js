import { run } from "graphile-worker";
import { pool } from "./db/pool.js";

async function main() {
  console.log("Starting Sherbrooke Real Estate Scraper...");
  
  const runner = await run({
    pgPool: pool,
    concurrency: 3, // Reduced for KVM2 plan
    noHandleSignals: false,
    pollInterval: 2000,
    taskDirectory: `${import.meta.dirname}/tasks`,
  });

  console.log("Scraper is running. Waiting for jobs...");
  await runner.promise;
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
