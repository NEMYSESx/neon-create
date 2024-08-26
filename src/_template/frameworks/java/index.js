// quarkus.js
import { createEnvFile, executeCommand } from "../../../bin/helper.js";

export default async function setupQuarkus(framework) {
  if (framework === "reactive") {
    console.log("Setting up NeonDB with Quarkus Reactive...");

    try {
      executeCommand("npm install dotenv");
      executeCommand(
        'mvn quarkus:add-extension -Dextensions="smallrye-reactive-messaging-smallrye-reactive-messaging-reactor vertx-reactive-sql-client-postgresql"'
      );

      const envContent = `
QUARKUS_DATASOURCE_REACTIVE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require
      `;
      createEnvFile(envContent);

      console.log(`
To complete the setup, follow these steps:
1. Create a new Java class named 'PostgresResource.java' in the same directory as your 'GreetingResource.java' file.
2. Paste the following code into 'PostgresResource.java':

package com.neon.tech;

import jakarta.inject.Inject;
import io.smallrye.mutiny.Multi;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.RowSet;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/postgres")
public class PostgresResource {

    @Inject
    io.vertx.mutiny.pgclient.PgPool client;

    @GET
    @Path("/version")
    @Produces(MediaType.TEXT_PLAIN)
    public Multi<String> getVersion() {
        return client.query("SELECT version()")
                .execute()
                .onItem().transformToMulti(this::extractVersion);
    }

    private Multi<String> extractVersion(RowSet<Row> rowSet) {
        return Multi.createFrom().iterable(rowSet)
                .map(r -> r.getValue(0).toString());
    }
}

3. Replace the placeholders in the .env file with your actual NeonDB credentials.
4. Deploy and run your Quarkus application, then navigate to http://localhost:8080/postgres/version to test the connection.
      `);

      console.log("NeonDB integration setup for Quarkus Reactive is complete.");
    } catch (error) {
      console.error(
        "Error during NeonDB setup for Quarkus Reactive:",
        error.message
      );
    }
  } else if (framework === "jdbc") {
    console.log("Setting up NeonDB with Quarkus JDBC...");

    try {
      executeCommand("npm install dotenv");
      executeCommand(
        'mvn quarkus:add-extension -Dextensions="quarkus-jdbc-postgresql"'
      );

      const envContent = `
QUARKUS_DATASOURCE_DB_KIND=postgresql
QUARKUS_DATASOURCE_USERNAME=[user]
QUARKUS_DATASOURCE_PASSWORD=[password]
QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://[neon_hostname]/[dbname]?sslmode=require
      `;
      createEnvFile(envContent);

      console.log(`
To complete the setup, follow these steps:
1. Create a new Java class named 'PostgresResource.java' in the same directory as your 'GreetingResource.java' file.
2. Paste the following code into 'PostgresResource.java':

package com.neon.tech;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.sql.DataSource;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/postgres")
public class PostgresResource {

    @Inject
    DataSource dataSource;

    @GET
    @Path("/version")
    @Produces(MediaType.TEXT_PLAIN)
    public String getVersion() {
        try (Connection connection = dataSource.getConnection();
                Statement statement = connection.createStatement()) {
            ResultSet resultSet = statement.executeQuery("SELECT version()");
            if (resultSet.next()) {
                return resultSet.getString(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}

3. Replace the placeholders in the .env file with your actual NeonDB credentials.
4. Deploy and run your Quarkus application, then navigate to http://localhost:8080/postgres/version to test the connection.
      `);

      console.log("NeonDB integration setup for Quarkus JDBC is complete.");
    } catch (error) {
      console.error(
        "Error during NeonDB setup for Quarkus JDBC:",
        error.message
      );
    }
  } else {
    console.error("Unsupported Quarkus framework!");
  }
}
