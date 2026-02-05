# # Use Maven with JDK (build + run)
# FROM maven:3.9-eclipse-temurin-17

# # Set working directory inside container
# WORKDIR /app

# # Copy pom.xml first (dependency cache)
# COPY pom.xml .

# # Download dependencies
# RUN mvn dependency:go-offline

# # Copy application source code
# COPY src ./src

# # Build the application
# RUN mvn clean package -DskipTests

# # Expose application port
# EXPOSE 8082

# # Expose debug port
# EXPOSE 5005

# # Run Spring Boot with full debug enabled
# ENTRYPOINT ["mvn", "spring-boot:run", \
#   "-Dspring-boot.run.jvmArguments=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", \
#   "-Dspring.output.ansi.enabled=ALWAYS", \
#   "-Dlogging.level.root=INFO", \
#   "-Dlogging.level.org.springframework=WARN", \
#   "-Dlogging.level.org.hibernate=WARN", \
#   "-Dlogging.level.com.zaxxer.hikari=DEBUG"]


# ---------- Build ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests clean package

# ---------- Run ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar (adjust if your jar name differs)
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082
EXPOSE 5005

# Debug port optional; keep if you need it
ENTRYPOINT ["java", \
  "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", \
  "-jar", "app.jar"]

