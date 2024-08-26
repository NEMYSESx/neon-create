import { createEnvFile, executeCommand } from "../../../../bin/helper.js";
import path from "path";
import fs from "fs";

const envFilePath = path.join(process.cwd(), ".env");
const drizzleConfigFilePath = path.join(process.cwd(), "drizzle.config.ts");

async function setupDrizzle() {
  console.log("Setting up NeonDB with Drizzle ORM...");

  try {
    executeCommand("npm install @drizzle/orm @neondatabase/serverless");

    const neonConnectionString =
      "postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require";
    const envContent = `DATABASE_URL="${neonConnectionString}"\n`;
    createEnvFile(envContent);

    const drizzleConfigContent = `
import { Drizzle } from '@drizzle/orm';
import { Pool } from 'pg';

// Initialize the PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Initialize Drizzle with the PostgreSQL pool
const drizzle = new Drizzle(pool);

export default drizzle;
    `.trim();

    fs.mkdirSync(path.dirname(drizzleConfigFilePath), { recursive: true });

    fs.writeFileSync(drizzleConfigFilePath, drizzleConfigContent, {
      encoding: "utf8",
    });
    console.log(`Drizzle configuration updated at ${drizzleConfigFilePath}.`);

    console.log("NeonDB integration setup for Drizzle ORM is complete.");
  } catch (error) {
    console.error("Error during Drizzle setup:", error.message);
  }
}

export default setupDrizzle;
