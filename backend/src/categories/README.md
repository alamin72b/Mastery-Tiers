### Enterprise Technical Specification: Mastery Tiers API

**1. Executive Summary**
The Mastery Tiers API provides a robust backend architecture for tracking hierarchical skill progression. It allows clients to create top-level categories, nest sub-categories (skills) beneath them, and dynamically calculate a user's overall "Mastery Tier" based on their lowest completed sub-skill. Built on NestJS and Prisma 7, the system ensures type-safe database interactions and enforces a globally standardized HTTP response structure to streamline frontend consumption.

**2. Architectural Design**
The feature follows a strict three-tier architecture:

* **Routing Layer (Controller):** Handles incoming HTTP requests and enforces parameter typing (e.g., `ParseIntPipe` for IDs).
* **Business Logic Layer (Service):** Calculates the `masteryTier` dynamically using a `Math.min()` aggregation across nested sub-categories, ensuring the parent tier accurately reflects the minimum threshold of all child components.
* **Data Access Layer (PrismaService):** Interfaces with a serverless PostgreSQL instance (Neon). It utilizes Prisma 7's standard client configuration, bypassing edge-specific driver adapters to prioritize stability in a standard Node.js deployment environment.
* **Middleware (Global Wrappers):** A generic `TransformInterceptor` and `HttpExceptionFilter` wrap all outgoing traffic, guaranteeing a uniform data shape regardless of success or failure.

**3. Data Contracts**
All API responses conform to a strict interface, eliminating the need for frontend payload-guessing.

| Property | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | Indicates if the operation completed without exceptions. |
| `statusCode` | `number` | The HTTP status code (e.g., 200, 201, 500). |
| `message` | `string` | Human-readable outcome description. |
| `data` | `T | null` | The requested payload (omitted or null on failure). |
| `error` | `string[]` | Array of error messages (omitted on success). |
| `timestamp` | `string` | ISO 8601 timestamp of the transaction. |
| `path` | `string` | The API endpoint that was accessed. |

**4. Deployment Standard Operating Procedures (SOP)**

1. **Environment Configuration:** Ensure `.env` contains a valid, pooled PostgreSQL connection string (`DATABASE_URL`).
2. **Schema Synchronization:** Run `bunx prisma db push` (or `migrate deploy` for production) to align the Neon database schema.
3. **Client Generation:** Run `bunx prisma generate` to build the TypeScript types into `node_modules`.
4. **Application Build:** Execute `bun run build` to compile the NestJS application.
5. **Service Startup:** Initialize the production server using `bun run start:prod`.

---

### Architecture Decision Record (ADR)

**Title:** Implementation of Computed Tiers and Standardized Interceptors
**Status:** Accepted

**Context:**
The Next.js frontend requires a predictable data structure to render UI components effectively, particularly when displaying aggregated category scores and handling API errors. Furthermore, persisting a `masteryTier` directly in the database introduces the risk of data staleness if sub-categories are modified or deleted.

**Decision:**

1. **Computed Properties:** We opted to calculate the `masteryTier` dynamically in the `CategoriesService` at request time, rather than storing it as a database column.
2. **Global Interceptors:** We implemented a `TransformInterceptor<T>` and an `HttpExceptionFilter` at the application bootstrap level (`main.ts`) to intercept all incoming requests and outgoing responses.

**Consequences:**

* **Positive:** The Next.js frontend can universally destructure `const { success, data, error } = await api.get(...)`. Database normalization is maintained with zero risk of desynchronized tier counts.
* **Negative/Mitigation:** Dynamic calculation slightly increases CPU load on `GET` requests, but the impact is negligible given the indexed foreign keys in PostgreSQL.
