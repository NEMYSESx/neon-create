import setupPrisma from "../_template/orms/javascript/prisma/index.js";
import setupSqlAlchemy from "../_template/orms/python/sqlAlchemy/index.js";
import setupDrizzle from "../_template/orms/javascript/drizzle/index.js";
import setupSequelize from "../_template/orms/javascript/sequelize/index.js";
import setupTypeORM from "../_template/orms/javascript/typeorm/index.js";
import setupFlyway from "../_template/orms/java/flyway/index.js";
import setupLiquibase from "../_template/orms/java/liquibase/index.js";
import setupNodeJS from "../_template/frameworks/javascript/index.js";

async function integrateORMs(answers) {
  const ormIntegrations = {
    JavaScript: {
      Prisma: () => setupPrisma(),
      TypeORM: () => setupTypeORM(),
      Sequelize: () => setupSequelize(),
      Drizzle: () => setupDrizzle(),
      psql: () => setupNodeJS(),
    },
    Python: {
      SQLAlchemy: () => setupSqlAlchemy(),
    },
    Java: {
      Flyway: () => setupFlyway(),
      Liquibase: () => setupLiquibase(),
    },
  };

  const { language, orm } = answers;

  if (ormIntegrations[language] && ormIntegrations[language][orm]) {
    try {
      await ormIntegrations[language][orm]();
    } catch (error) {
      console.error(
        `Error integrating ${orm} with ${language}:`,
        error.message
      );
    }
  } else {
    console.log("No integration available for this combination.");
  }
}

export default integrateORMs;
