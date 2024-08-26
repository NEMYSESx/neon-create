import path from "path";
import fs from "fs";

const flywayConfigFilePath = path.join(process.cwd(), "flyway.conf");

async function setupFlyway() {
  console.log("Setting up Flyway with NeonDB...");

  try {
    const flywayUrl =
      "jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/neondb";
    const flywayUser = "alex";
    const flywayPassword = "AbC123dEf";

    const flywayConfigContent = `
flyway.url=${flywayUrl}
flyway.user=${flywayUser}
flyway.password=${flywayPassword}
flyway.locations=filesystem:sql
    `.trim();

    fs.mkdirSync(path.dirname(flywayConfigFilePath), { recursive: true });

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
