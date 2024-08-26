// cSharp.js
import { createEnvFile, executeCommand } from "../../../bin/helper.js";

export default async function cSharp() {
  console.log("Setting up NeonDB with Entity Framework...");

  try {
    console.log("Installing NuGet packages...");
    executeCommand("dotnet add package Microsoft.EntityFrameworkCore");
    executeCommand("dotnet add package Microsoft.EntityFrameworkCore.Design");
    executeCommand("dotnet add package Microsoft.AspNetCore.App");
    executeCommand("dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL");
    executeCommand("dotnet add package dotenv.net");
    console.log("NuGet packages installed successfully.");

    console.log("Installing dotnet-ef tool globally...");
    executeCommand("dotnet tool install --global dotnet-ef");
    console.log("dotnet-ef tool installed successfully.");

    const envContent = `
DATABASE_URL=NEON_POSTGRES_CONNECTION_STRING
    `.trim();
    createEnvFile(envContent);

    console.log(
      "NeonDB integration setup for Entity Framework is complete. Don't forget to replace NEON_POSTGRES_CONNECTION_STRING with your actual connection string."
    );
  } catch (error) {
    console.error(
      "Error during NeonDB setup with Entity Framework:",
      error.message
    );
  }
}
