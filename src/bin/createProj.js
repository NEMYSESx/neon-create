import inquirer from "inquirer";
import integrateFrameworks from "./integrateFrameworks.js";
import integrateORMs from "./integrateOrms.js";

async function createProject() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "language",
      message: "Which programming language are you using?",
      choices: [
        "JavaScript",
        "Python",
        "Java",
        "Ruby",
        "Rust",
        "Go",
        "Elixir",
        "Csharp",
      ],
    },
    {
      type: "list",
      name: "framework",
      message: "Which framework are you using?",
      choices: (answers) => {
        switch (answers.language) {
          case "JavaScript":
            return [
              "Next.js",
              "Remix",
              "Solid Start",
              "NestJS",
              "Express",
              "Node.js",
              "Astro",
            ];
          case "Python":
            return ["Django", "psql"];
          case "Java":
            return ["Quarkus (Reactive)", "Quarkus (JDBC)", "psql"];
          case "Ruby":
            return ["Rails"];
          case "Csharp":
            return ["Entity Framework"];
          default:
            return [];
        }
      },
      when: (answers) =>
        ["JavaScript", "Python", "Java", "Ruby", "Csharp"].includes(
          answers.language
        ),
    },
    {
      type: "list",
      name: "orm",
      message: "Which ORM or database tool would you like to use?",
      choices: (answers) => {
        switch (answers.language) {
          case "JavaScript":
            return ["Prisma", "TypeORM", "Sequelize", "Drizzle", "psql"];
          case "Python":
            return ["SQLAlchemy"];
          case "Java":
            return ["Flyway", "Liquibase"];
          default:
            return [];
        }
      },
      when: (answers) =>
        !["psql", "Entity Framework"].includes(answers.framework),
    },
  ]);
  console.log("Selected options:", answers);
  integrateFrameworks(answers);
  integrateORMs(answers);
}

export default createProject;
