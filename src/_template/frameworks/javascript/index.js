import { createEnvFile, executeCommand } from "../../../bin/helper.js";

export default async function setupNodeJS(framework) {
  switch (framework) {
    case "nextjs":
    case "Remix":
    case "Solid Start":
    case "NestJS":
    case "Express":
    case "Node.js":
    case "Astro":
    case "psql":
      console.log(`Setting up NeonDB with ${framework}...`);
      break;
    default:
      console.error("Unsupported framework!");
      return;
  }

  try {
    if (["Express", "Node.js", "psql"].includes(framework)) {
      executeCommand("npm install @neondatabase/serverless dotenv");
    } else {
      executeCommand("npm install @neondatabase/serverless");
    }

    const envContent =
      framework === "Node.js"
        ? `
PGHOST="[neon_hostname]"
PGDATABASE="[dbname]"
PGUSER="[user]"
PGPASSWORD="[password]"
ENDPOINT_ID="[endpoint_id]"
        `.trim()
        : 'DATABASE_URL="postgres://username:password@hostname:port/database"';

    createEnvFile(envContent);

    console.log(`NeonDB integration setup for ${framework} is complete.`);
  } catch (error) {
    console.error(`Error during NeonDB setup for ${framework}:`, error.message);
  }
}
