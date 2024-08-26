import { createEnvFile } from "../../../../bin/helper.js";
import path from "path";
import fs from "fs";

// Define paths to the Prisma schema and .env files
const prismaSchemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
const envFilePath = path.join(process.cwd(), ".env");

async function setupPrisma() {
  console.log("Setting up NeonDB with Prisma...");

  try {
    // Define the datasource configuration for Prisma schema
    const datasource = `
datasource db {
  provider = "postgresql"
  url   = env("DATABASE_URL")
}
`;

    // Check if datasource section already exists in schema.prisma
    if (fs.existsSync(prismaSchemaPath)) {
      let schemaContent = fs.readFileSync(prismaSchemaPath, "utf8");

      if (!schemaContent.includes("datasource db")) {
        // Append datasource configuration to the schema
        schemaContent += `\n${datasource}`;
        fs.writeFileSync(prismaSchemaPath, schemaContent, { encoding: "utf8" });
        console.log("Prisma schema updated with datasource.");
      } else {
        console.log(
          "Prisma schema already contains a datasource configuration."
        );
      }
    } else {
      console.error("Prisma schema file not found.");
    }

    // Define the DATABASE_URL for .env file
    const neonConnectionString =
      "postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require";
    const envContent = `DATABASE_URL="${neonConnectionString}"\n`;

    // Check if .env file exists
    if (fs.existsSync(envFilePath)) {
      let envContentExisting = fs.readFileSync(envFilePath, "utf8");

      if (!envContentExisting.includes("DATABASE_URL")) {
        fs.appendFileSync(envFilePath, envContent, { encoding: "utf8" });
        console.log(".env file updated with DATABASE_URL.");
      } else {
        console.log("DATABASE_URL already exists in .env file.");
      }
    } else {
      createEnvFile(envContent);
    }

    console.log(`
To complete the setup:
1. Open your Prisma schema file (prisma/schema.prisma).
2. Make sure the following datasource configuration is present:

${datasource.trim()}

3. Run the following command to generate Prisma client:

npx prisma generate
    `);

    console.log("NeonDB integration setup for Prisma is complete.");
  } catch (error) {
    console.error("Error during Prisma setup:", error.message);
  }
}

export default setupPrisma;
