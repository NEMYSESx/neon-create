import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * Creates a .env file with the specified content.
 * @param {string} content - The content to be written to the .env file.
 * @param {string} [filePath] - Optional file path for the .env file.
 */
export function createEnvFile(
  content,
  filePath = path.join(process.cwd(), ".env")
) {
  fs.writeFileSync(filePath, content.trim(), { encoding: "utf8" });
  console.log(`.env file created at ${filePath}`);
}

/**
 * Executes a shell command and handles errors.
 * @param {string} command - The shell command to execute.
 * @param {object} [options] - Optional options for the execSync function.
 */
export function executeCommand(command, options = { stdio: "inherit" }) {
  try {
    execSync(command, options);
    console.log(`Command executed: ${command}`);
  } catch (error) {
    console.error(`Error executing command: ${command}`, error.message);
  }
}
