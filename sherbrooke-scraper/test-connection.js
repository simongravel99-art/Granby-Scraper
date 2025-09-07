import { pool } from "./db/pool.js";
import { createRandomProxyClient } from "./proxy/createRandomProxyClient.js";

async function testConnections() {
  console.log("Testing connections...");
  
  // Test database
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    console.log("✓ Database connection successful:", result.rows[0].current_time);
  } catch (error) {
    console.error("✗ Database connection failed:", error.message);
  }
  
  // Test proxy
  try {
    const client = createRandomProxyClient();
    const response = await client.get('https://httpbin.org/ip', { timeout: 10000 });
    console.log("✓ Proxy connection successful. IP:", response.data.origin);
  } catch (error) {
    console.error("✗ Proxy connection failed:", error.message);
  }
  
  await pool.end();
}

testConnections();

