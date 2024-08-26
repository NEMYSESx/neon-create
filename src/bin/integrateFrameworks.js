import nextjs from "../_template/frameworks/javascript/index.js";
import django from "../_template/frameworks/python/index.js";
import quarkus from "../_template/frameworks/java/index.js";
import rails from "../_template/frameworks/ruby/index.js";
import cSharp from "../_template/frameworks/cSharp/index.js";

async function integrateFrameworks(answers) {
  const frameworkIntegrations = {
    JavaScript: {
      "Next.js": () => nextjs("nextjs"),
      Remix: () => nextjs("Remix"),
      "Solid Start": () => nextjs("Solid Start"),
      NestJS: () => nextjs("NestJS"),
      Express: () => nextjs("Express"),
      "Node.js": () => nextjs("Node.js"),
      Astro: () => nextjs("Astro"),
    },
    Python: {
      Django: () => django("Django"),
      psql: () => django("psql"),
    },
    Java: {
      "Quarkus (Reactive)": () => quarkus("reactive"),
      "Quarkus (JDBC)": () => quarkus("jdbc"),
    },
    Ruby: {
      Rails: () => rails(),
    },
    Csharp: {
      "Entity Framework": () => cSharp(),
    },
  };

  const { language, framework } = answers;

  if (
    frameworkIntegrations[language] &&
    frameworkIntegrations[language][framework]
  ) {
    try {
      await frameworkIntegrations[language][framework]();
    } catch (error) {
      console.error(
        `Error integrating ${framework} with ${language}:`,
        error.message
      );
    }
  } else {
    console.log("No integration available for this combination.");
  }
}

export default integrateFrameworks;
