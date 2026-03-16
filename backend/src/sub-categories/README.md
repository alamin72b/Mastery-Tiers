## Architecture Decision Record (ADR)

**ADR 002: Implementation of Nested Sub-Category API**

* **Status:** Accepted
* **Context:** The application requires a hierarchical relationship between Categories and Sub-Categories. We needed to decide how to represent this relationship in the REST API.
* **Decision:** We chose **Option A: Nested URL Routing** (`/categories/:id/subcategories`).
* **Consequences:** * **Pros:** Clearer hierarchical relationship; simplifies the frontend logic for "Add Sub-Category" inside a specific category view.
* **Cons:** Slightly more complex controller logic to handle path parameters alongside request bodies.



---

## Enterprise Technical Specification

**Project:** Mastery Tiers | **Feature:** Sub-Category Management

### 1. Executive Summary

This feature enables users to break down broad "Mastery Tiers" categories into granular "Sub-Categories." It leverages the existing NestJS validation pipeline and Prisma's relational mapping to ensure data integrity and a standardized response format.

### 2. Architectural Design

The implementation follows a strict Layered Architecture:

* **Transport Layer:** NestJS Controller captures `:categoryId` via URL parameters.
* **Validation Layer:** `CreateSubCategoryDto` inherits from `CreateCategoryDto` to enforce dry-run validation rules.
* **Domain Layer:** `SubCategoriesService` handles the business logic of connecting entities.
* **Persistence Layer:** Prisma ORM executes a relational `connect` query in PostgreSQL.

### 3. Data Contracts (API Interface)

**Endpoint:** `POST /categories/:categoryId/subcategories`

**Request Body (JSON):**

```json
{
  "name": "string (min: 3, max: 50)"
}

```

**Response Wrapper (Global Interceptor):**
| Field | Type | Description |
| :--- | :--- | :--- |
| `statusCode` | Number | HTTP success/error code |
| `data` | Object | The created sub-category object |
| `message` | String | (Optional) Error detail |

---

### 4. Deployment Standard Operating Procedures (SOP)

1. **Dependency Audit:** Run `bun install` to ensure `@nestjs/mapped-types` and `class-validator` are present.
2. **Schema Migration:** Verify `prisma/schema.prisma` contains the `SubCategory` model with the `category` relation.
3. **Database Sync:** Run `bunx prisma migrate dev` if the schema was updated.
4. **Verification:** Execute the `curl` test provided in the previous step.
