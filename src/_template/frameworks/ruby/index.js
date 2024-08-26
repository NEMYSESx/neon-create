// rails.js
import { createEnvFile, executeCommand } from "../../../bin/helper.js";

export default async function setupRails() {
  console.log("Setting up NeonDB with Ruby on Rails...");

  try {
    const envContent = `
DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]
    `;
    createEnvFile(envContent);

    executeCommand("source .env");
    executeCommand("bin/rails db:create");

    console.log("NeonDB integration setup for Rails is complete.");
  } catch (error) {
    console.error("Error during NeonDB setup for Rails:", error.message);
  }
}
