import fs from "fs";
import path from "path";

const liquibaseConfigFilePath = path.join(
  process.cwd(),
  "liquibase.properties"
);

async function setupLiquibase() {
  console.log("Setting up Liquibase with NeonDB...");

  try {
    const targetDatabaseUrl =
      "jdbc:postgresql://ep-silent-hill-85675036.us-east-2.aws.neon.tech:5432/blog";
    const targetDatabaseUser = "alex";
    const targetDatabasePassword = "AbC123dEf";

    const referenceDatabaseUrl =
      "jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/blog";
    const referenceDatabaseUser = "alex";
    const referenceDatabasePassword = "AbC123dEf";

    const liquibaseConfigContent = `
changeLogFile=dbchangelog.xml
liquibase.command.url=${targetDatabaseUrl}
liquibase.command.username=${targetDatabaseUser}
liquibase.command.password=${targetDatabasePassword}
liquibase.command.referenceUrl=${referenceDatabaseUrl}
liquibase.command.referenceUsername=${referenceDatabaseUser}
liquibase.command.referencePassword=${referenceDatabasePassword}
    `.trim();

    fs.writeFileSync(liquibaseConfigFilePath, liquibaseConfigContent, {
      encoding: "utf8",
    });
    console.log(
      `Liquibase configuration updated at ${liquibaseConfigFilePath}.`
    );

    console.log("Liquibase integration setup for NeonDB is complete.");
  } catch (error) {
    console.error("Error during Liquibase setup:", error.message);
  }
}

export default setupLiquibase;
