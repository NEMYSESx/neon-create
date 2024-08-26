import { createEnvFile, executeCommand } from "../../../../bin/helper.js";
import path from "path";
import fs from "fs";

const envFilePath = path.join(process.cwd(), ".env");
const dataSourceFilePath = path.join(process.cwd(), "src", "data-source.ts");

async function setupTypeORM() {
  console.log("Setting up NeonDB with TypeORM...");

  try {
    executeCommand("npm install typeorm pg");

    const neonConnectionString =
      "postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require";
    const envContent = `DATABASE_URL="${neonConnectionString}"\n`;
    createEnvFile(envContent);

    const dataSourceContent = `
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  entities: [
    // list of entities
  ],
});
    `.trim();

    fs.mkdirSync(path.dirname(dataSourceFilePath), { recursive: true });

    fs.writeFileSync(dataSourceFilePath, dataSourceContent, {
      encoding: "utf8",
    });
    console.log(
      `TypeORM DataSource configuration updated at ${dataSourceFilePath}.`
    );

    console.log("NeonDB integration setup for TypeORM is complete.");
  } catch (error) {
    console.error("Error during TypeORM setup:", error.message);
  }
}

export default setupTypeORM;
