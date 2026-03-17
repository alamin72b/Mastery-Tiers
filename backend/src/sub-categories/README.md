# Architecture Decision Record (ADR)

**ADR 002: Implementation of Nested Sub-Category API**

* **Status:** Accepted
* **Context:** The application requires a hierarchical relationship between Categories and Sub-Categories. We needed to decide how to represent this relationship in the REST API.
* **Decision:** We chose **Option A: Nested URL Routing** (`/categories/:id/subcategories`).
* **Consequences:** * **Pros:** Clearer hierarchical relationship; simplifies the frontend logic for "Add Sub-Category" inside a specific category view.
* **Cons:** Slightly more complex controller logic to handle path parameters alongside request bodies.



---

## Enterprise Technical Specification

**Project:** Mastery Tiers | **Feature:** Sub-Category Management (CRUD)

### 1. Executive Summary

This feature enables users to create, update, and delete granular "Sub-Categories" nested within parent Categories. It leverages the NestJS validation pipeline, Prisma's relational mapping, and `@nestjs/mapped-types` to ensure data integrity across the full lifecycle of a sub-category.

### 2. Architectural Design

The implementation follows a strict **Layered Architecture**:

* **Transport Layer:** NestJS Controller captures `:categoryId` and `:id` via URL parameters for scoped requests.
* **Validation Layer:** * `CreateSubCategoryDto` inherits from `CreateCategoryDto`.
* `UpdateSubCategoryDto` utilizes `PartialType` to allow optional field updates.


* **Domain Layer:** `SubCategoriesService` handles the business logic of connecting entities and executing updates/deletions.
* **Persistence Layer:** Prisma ORM executes relational queries (connect, update, delete) in PostgreSQL.

### 3. Data Contracts (API Interface)

| Method | Endpoint | Description |
| --- | --- | --- |
| **POST** | `/categories/:categoryId/subcategories` | Create a new sub-category |
| **PATCH** | `/categories/:categoryId/subcategories/:id` | Update an existing sub-category |
| **DELETE** | `/categories/:categoryId/subcategories/:id` | Remove a sub-category |

**Response Wrapper (Global Interceptor):**
Standardized envelope applied to all successful responses: `{ "statusCode": 201/200, "data": { ... } }`.

---

### 4. Deployment Standard Operating Procedures (SOP)

1. **Dependency Audit:** Ensure `class-validator`, `class-transformer`, and `@nestjs/mapped-types` are in `package.json`.
2. **Schema Migration:** Verify `SubCategory` model exists in `schema.prisma`.
3. **Database Sync:** Run `bunx prisma migrate dev` for any schema changes.
4. **Verification:** Execute `curl -X PATCH` and `curl -X DELETE` against the nested endpoints.
