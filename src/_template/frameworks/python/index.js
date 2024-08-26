import { createEnvFile, executeCommand } from "../../../bin/helper.js";

export default async function setupDjango() {
  console.log("Setting up NeonDB with Django...");

  try {
    executeCommand("pip install psycopg2-binary python-dotenv");

    const envContent = `
PGHOST='[neon_hostname]'
PGDATABASE='[dbname]'
PGUSER='[user]'
PGPASSWORD='[password]'
    `;
    createEnvFile(envContent);

    console.log(`
To complete the setup:
1. Open your Django project's settings.py file.
2. Add the following imports at the top:

from os import getenv
from dotenv import load_dotenv
load_dotenv()

3. Replace the DATABASES section with:

DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': getenv('PGDATABASE'),
    'USER': getenv('PGUSER'),
    'PASSWORD': getenv('PGPASSWORD'),
    'HOST': getenv('PGHOST'),
    'PORT': getenv('PGPORT', 5432),
    'OPTIONS': {
      'sslmode': 'require',
    },
    'DISABLE_SERVER_SIDE_CURSORS': True,
  }
}
    `);

    console.log("NeonDB integration setup for Django is complete.");
  } catch (error) {
    console.error("Error during Django setup:", error.message);
  }
}
