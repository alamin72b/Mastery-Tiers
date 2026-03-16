### Enterprise Technical Specification: Mastery Tiers API (V2)

**1. Executive Summary**
The Mastery Tiers API provides a robust backend architecture for tracking hierarchical skill progression. It allows for full **CRUD (Create, Read, Update, Delete)** operations on Categories and nested Sub-categories. Built on NestJS and Prisma 7, the system ensures type-safe database interactions and enforces a globally standardized HTTP response structure.

**2. Architectural Design**

* **Routing Layer:** Utilizes **Nested RESTful routing** (`/categories/:id/subcategories`) to maintain clear ownership of resources.
* **Validation Layer:** Implements `PartialType` for Update DTOs, allowing clients to patch only the fields they need while maintaining strict validation rules.
* **Business Logic Layer:** * **Computed Tiers:** Calculates `masteryTier` dynamically using a `Math.min()` aggregation.
* **Relational Integrity:** Ensures sub-categories are correctly connected to parents via Prisma's `connect` API.


* **Persistence Layer:** PostgreSQL via Neon, utilizing **Cascade Deletion** logic—removing a Category automatically purges all child Sub-categories to prevent "orphaned" data.

**3. Data Contracts (Updated)**
All endpoints now return the standardized envelope:

| Property | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | True for 2xx codes, false otherwise. |
| `data` | `T | null` | The updated/deleted record or the computed tier object. |
| `path` | `string` | The requested endpoint (useful for debugging). |

**4. Deployment Standard Operating Procedures (SOP)**

1. **Dependency Check:** Run `bun install` to ensure `@nestjs/mapped-types` is available for `PartialType` support.
2. **Schema Check:** Verify `onDelete: Cascade` is set on the `SubCategory -> Category` relation in `prisma.schema`.
3. **Migration:** Run `bunx prisma migrate dev` to commit the cascading deletion logic to PostgreSQL.

---

### Architecture Decision Record (ADR)

**ADR 005: Implementation of CRUD Operations and Cascade Deletion**
**Status:** Accepted

**Context:**
As the Mastery Tiers system expands, users need to rename or remove skills. We must ensure that updating a name doesn't require resending the entire object and that deleting a category doesn't leave "ghost" sub-categories in the database.

**Decision:**

1. **Partial Updates:** Use `@nestjs/mapped-types` to create `Update` DTOs.
2. **Cascade Deletion:** Configure the database schema so that deleting a Category triggers a cascade delete of its Sub-categories.
3. **Nested Management:** Manage sub-categories via nested paths to reinforce the parent-child constraint.

**Consequences:**

* **Positive:** Minimal bandwidth usage for updates. Zero manual cleanup required for sub-categories.
* **Negative/Mitigation:** Risk of accidental data loss. *Mitigation:* Frontend must implement a "Danger Zone" confirmation dialog for Category deletion.
