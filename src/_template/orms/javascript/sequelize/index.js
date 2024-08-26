import { createEnvFile, executeCommand } from "../../../../bin/helper.js";
import path from "path";
import fs from "fs";

const envFilePath = path.join(process.cwd(), ".env");
const configDirPath = path.join(process.cwd(), "config");
const configFilePath = path.join(configDirPath, "config.js");
const sequelizercFilePath = path.join(process.cwd(), ".sequelizerc");

async function setupSequelize() {
  console.log("Setting up NeonDB with Sequelize...");

  try {
    executeCommand("npm install sequelize pg pg-hstore");
    executeCommand("npm install sequelize-cli --save-dev");

    const neonConnectionString =
      "postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require";
    const envContent = `DATABASE_URL="${neonConnectionString}"\n`;
    createEnvFile(envContent);

    executeCommand("npx sequelize init");

    if (!fs.existsSync(configFilePath)) {
      const configContent = `
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true } },
  },
};
      `.trim();
      fs.mkdirSync(configDirPath, { recursive: true });
      fs.writeFileSync(configFilePath, configContent, { encoding: "utf8" });
      console.log("Sequelize config file created at config/config.js.");
    } else {
      console.log("Sequelize config file already exists.");
    }

    if (!fs.existsSync(sequelizercFilePath)) {
      const sequelizercContent = `
const path = require('path');
module.exports = {
  'config': path.resolve('config', 'config.js'),
  'models-path': path.resolve('models'),
  'migrations-path': path.resolve('migrations'),
  'seeders-path': path.resolve('seeders')
};
      `.trim();
      fs.writeFileSync(sequelizercFilePath, sequelizercContent, {
        encoding: "utf8",
      });
      console.log(".sequelizerc file created.");
    } else {
      console.log(".sequelizerc file already exists.");
    }

    console.log("NeonDB integration setup for Sequelize is complete.");
  } catch (error) {
    console.error("Error during Sequelize setup:", error.message);
  }
}

export default setupSequelize;
