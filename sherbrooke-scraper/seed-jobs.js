import { pool } from "./db/pool.js";
import dotenv from "dotenv";

dotenv.config();

async function seedJobs() {
  console.log("Seeding scraper jobs...");
  
  // Example matricule numbers - replace with actual ones you want to scrape
  const matricules = [
   1009300
1009301
1009305



    // Add more real matricule numbers here
  ];
  
  try {
    for (const matricule of matricules) {
      const url = `https://vplus.modellium.com/api/espace-evaluation.sherbrooke.ca/role/search/info-ue?matricule=${matricule}`;
      
      await pool.query(
        `INSERT INTO pages (project, url, scrape_method) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (project, url) DO NOTHING`,
        ['gig_real_estate/sherbrooke_full', url, 'axiosJson']
      );
      
      console.log(`Added job for matricule: ${matricule}`);
    }
    
    console.log("✓ Jobs seeded successfully");
  } catch (error) {
    console.error("✗ Error seeding jobs:", error);
  } finally {
    await pool.end();
  }
}

seedJobs();
