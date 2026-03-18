# Blog Management System

A robust and feature-rich RESTful API for a Blog Management System, built with **Spring Boot 3** and **Java 17**.

## 🚀 Features

- **User Authentication:** Secure authentication and authorization using JSON Web Tokens (JWT) and Spring Security.
- **RESTful API:** Clean and standardized REST endpoints for managing users, posts, and related resources.
- **URL Analysis Tool:** Special feature using Jsoup to parse and extract metadata (title, description), and verify security protocols of given URLs.
- **Database Integration:** Integrated with PostgreSQL via Spring Data JPA for data persistence.
- **API Documentation:** Interactive documentation and testing available through Swagger UI / OpenAPI 3.

## 🛠️ Technology Stack

- **Java 17**
- **Spring Boot 3.3.5** (Web, Data JPA, Security, Validation)
- **PostgreSQL** (Database)
- **JWT (io.jsonwebtoken)** for security
- **Jsoup** for HTML parsing and URL metadata extraction
- **Lombok** to reduce boilerplate code
- **Springdoc OpenAPI (Swagger)** for API testing and documentation

## ⚙️ Getting Started

### Prerequisites
- JDK 17 or higher
- Maven 3.6+ (Optional, embedded wrapper can be used)
- PostgreSQL installed and running locally

### Installation & Setup

1. **Configure the Database:**
   Ensure PostgreSQL is running and create a database (e.g., `blog_db`).
   Update your `src/main/resources/application.properties` or `application.yml` file with your PostgreSQL credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/your_database_name
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

2. **Build and Run the Application:**
   Navigate to the root directory of the project and execute:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   *Alternatively, you can run the application directly from your IDE by executing the main `BlogManagementSystemApplication` class.*

## 📚 API Documentation

Once the application is running, you can access the Swagger UI interface to explore and test the available REST endpoints.

- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`

## 🧩 URL Analysis Feature

A distinctive feature of this application is the endpoint available for analyzing external web links. It connects to the provided URL, fetching crucial Open Graph metadata (like title and description) to provide rich previews.

## 📄 License

This project is licensed under the MIT License.
