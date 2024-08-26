import path from "path";
import fs from "fs";

// Define the path to the flyway.conf file
const flywayConfigFilePath = path.join(process.cwd(), "flyway.conf");

// Flyway setup function
async function setupFlyway() {
  console.log("Setting up Flyway with NeonDB...");

  try {
    // Retrieve your connection details from NeonDB
    const flywayUrl =
      "jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/neondb";
    const flywayUser = "alex";
    const flywayPassword = "AbC123dEf";

    // Create Flyway configuration
    const flywayConfigContent = `
flyway.url=${flywayUrl}
flyway.user=${flywayUser}
flyway.password=${flywayPassword}
flyway.locations=filesystem:sql
    `.trim();

    // Ensure the conf directory exists
    fs.mkdirSync(path.dirname(flywayConfigFilePath), { recursive: true });

    // Write the Flyway configuration to the file
    fs.writeFileSync(flywayConfigFilePath, flywayConfigContent, {
      encoding: "utf8",
    });
    console.log(`Flyway configuration updated at ${flywayConfigFilePath}.`);

    console.log("Flyway integration setup for NeonDB is complete.");
  } catch (error) {
    console.error("Error during Flyway setup:", error.message);
  }
}

export default setupFlyway;
