import { createEnvFile, executeCommand } from "../../../../bin/helper.js";
import path from "path";
import fs from "fs";

const envFilePath = path.join(process.cwd(), ".env");
const sqlalchemyConfigFilePath = path.join(
  process.cwd(),
  "sqlalchemy_config.py"
);

async function setupSqlAlchemy() {
  console.log("Setting up NeonDB with SQLAlchemy...");

  try {
    executeCommand("pip install psycopg2-binary");

    const neonConnectionString =
      "postgresql://[user]:[password]@[neon_hostname]/[dbname]";
    const envContent = `DATABASE_URL="${neonConnectionString}"\n`;
    createEnvFile(envContent);

    const sqlalchemyConfigContent = `
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the database URL from the environment
DATABASE_URL = os.getenv('DATABASE_URL')

# Create SQLAlchemy engine and session
engine = create_engine(DATABASE_URL, echo=True, pool_size=10, max_overflow=20, connect_args={"sslmode": "require"})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    `.trim();

    fs.mkdirSync(path.dirname(sqlalchemyConfigFilePath), { recursive: true });

    fs.writeFileSync(sqlalchemyConfigFilePath, sqlalchemyConfigContent, {
      encoding: "utf8",
    });
    console.log(
      `SQLAlchemy configuration updated at ${sqlalchemyConfigFilePath}.`
    );

    console.log("NeonDB integration setup for SQLAlchemy is complete.");
  } catch (error) {
    console.error("Error during SQLAlchemy setup:", error.message);
  }
}

export default setupSqlAlchemy;
