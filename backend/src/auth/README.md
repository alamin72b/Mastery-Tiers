### Enterprise Technical Specification: Google OAuth & JWT Authentication

**1. Executive Summary**
The Authentication module provides a secure, stateless login mechanism using Google OAuth 2.0 and JSON Web Tokens (JWT). By leveraging Passport.js within the NestJS framework, the system authenticates users via their Google credentials, upserts the user profile into the PostgreSQL database, and issues a cryptographically signed JWT. This token is delivered to the decoupled Next.js frontend via a secure URL redirect, establishing a stateless session that can be verified on subsequent API requests.

**2. Architectural Design**
The authentication flow utilizes a delegated identity model:
* **Entry Point (Controller):** `GET /auth/google` initiates the OAuth 2.0 flow, redirecting the client to Google's consent screen.
* **Identity Verification (Strategy):** `GoogleStrategy` intercepts the callback at `/auth/google/callback`, extracting the user's `Profile` (Google ID, email, and name).
* **Persistence Layer (Service):** The `AuthService` performs an atomic `upsert` via Prisma, ensuring the user exists in the database without creating duplicate records.
* **Token Issuance:** The `JwtModule` (configured with a secure secret and 7-day expiration) generates a JWT containing the user's internal database ID (`sub`) and email.
* **Handoff:** The NestJS controller issues an HTTP 302 Redirect to the configured `FRONTEND_URL`, appending the JWT as a query parameter (`?token=...`) for the Next.js client to ingest and store securely.

**3. Data Contracts**

**JWT Payload Structure (Decoded)**
| Property | Type | Description |
| :--- | :--- | :--- |
| `sub` | `number` | The internal Prisma Database ID of the user. |
| `email` | `string` | The user's authenticated Google email address. |
| `iat` | `number` | Issued At timestamp. |
| `exp` | `number` | Expiration timestamp (7 days from issuance). |

**4. Deployment Standard Operating Procedures (SOP)**
1.  **GCP Configuration:** Ensure the target environment's callback URL (e.g., `https://api.domain.com/auth/google/callback`) is explicitly whitelisted in the Google Cloud Console under "Authorized redirect URIs".
2.  **Environment Variables:** The deployment environment must contain:
    * `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
    * `GOOGLE_CALLBACK_URL`
    * `JWT_SECRET` (Must be a cryptographically strong, randomized string in production)
    * `FRONTEND_URL` (The exact origin of the Next.js application to prevent open redirect vulnerabilities)

---

### Architecture Decision Record (ADR)

**Title:** Implementation of JWT-Based Stateless Authentication over Session Cookies
**Status:** Accepted

**Context:**
The architecture consists of a NestJS backend and a Next.js frontend, potentially running on different subdomains or ports (e.g., `localhost:3000` vs `localhost:3001` or `api.domain.com` vs `app.domain.com`). We needed a secure way to maintain user state across this decoupled system after a successful Google OAuth login.

**Decision:**
We opted to use JSON Web Tokens (JWT) passed via a one-time URL redirect, rather than relying on server-side session state and HTTP-only cookies managed by NestJS.

**Consequences:**
* **Positive:** Complete decoupling. The Next.js frontend can ingest the token from the URL, store it in a secure local mechanism (like an HTTP-only Next.js API route cookie or local storage), and append it as a `Bearer` token in the `Authorization` header for all future requests. The backend remains 100% stateless and infinitely scalable.
* **Negative/Mitigation:** Passing the token in the URL makes it briefly visible in browser history. This is mitigated by the frontend immediately consuming the token, storing it, and stripping it from the URL using Next.js router replacement (`router.replace('/dashboard')`) upon initial load.
