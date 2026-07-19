# Test Report — Car Dealership Inventory API

> **Generated:** 2026-07-19  
> **Runtime:** Jest 30.4.2 · ts-jest 29.4.11 · Node.js · TypeScript 6.0.3  
> **Result:** ✅ **All 24 tests passed** (13 unit + 11 integration)

---

## Executive Summary

| Metric              | Value      |
|---------------------|------------|
| **Test Suites**     | 4 passed, 0 failed |
| **Total Tests**     | 24 passed, 0 failed |
| **Unit Tests**      | 13 passed |
| **Integration Tests** | 11 passed |
| **Unit Duration**   | 4.302 s    |
| **Integration Duration** | 11.894 s |
| **Snapshots**       | 0          |

---

## Test Architecture

### Testing Strategy

The project follows a **two-tier testing strategy**:

- **Unit Tests** — Test service-layer business logic in isolation using mocked repositories, bcrypt, and jsonwebtoken.
- **Integration Tests** — Full HTTP request → database round-trip tests via `supertest` against a real PostgreSQL instance.

| Layer | Approach | DB Required | Mocking |
|-------|----------|-------------|---------|
| **Unit** | Tests service logic in isolation | No | Repository, bcrypt, jsonwebtoken mocked |
| **Integration** | Full HTTP request → DB round-trip via `supertest` | Yes (PostgreSQL) | None — real DB with `resetDb()` between tests |

### Test Infrastructure

| Component | File | Purpose |
|-----------|------|---------|
| Jest config | `jest.config.js` | ts-jest transform, node environment |
| Setup file | `jest.setup.ts` | Loads `.env.test` via dotenv |
| DB reset utility | `src/test-utils/resetDb.ts` | Truncates `vehicles`, `users` tables with identity restart |

### NPM Scripts

```
npm test               # Unit tests only (excludes integration)
npm run test:integration  # Integration tests only (uses .env.test, runs serially)
npm run test:all          # Unit + Integration combined
npm run test:coverage     # Unit tests with coverage report
npm run test:watch        # Watch mode for unit tests
```

---

## Unit Test Results

> **Command:** `npx jest --testPathIgnorePatterns=integration --verbose`  
> **Duration:** 4.302 s · **Suites:** 2 passed · **Tests:** 13 passed

### Auth Service — `auth.test.ts`

Tests the `authService` business logic with mocked repository, bcrypt, and jsonwebtoken.

| # | Test Case | Status | Time |
|---|-----------|--------|------|
| 1 | creates a new user when the email is not taken | ✅ Pass | 19 ms |
| 2 | rejects registration when the email already exists | ✅ Pass | 55 ms |
| 3 | returns a token when credentials are valid | ✅ Pass | 2 ms |
| 4 | rejects login when the password is wrong | ✅ Pass | 4 ms |
| 5 | rejects login when the email is unknown | ✅ Pass | 2 ms |

**Mocking Details:**
- `auth.repository` — fully mocked via `jest.mock()`
- `bcrypt` — `hash` returns `'hashed-password'`, `compare` is controllable per test
- `jsonwebtoken` — `sign` returns `'fake-jwt-token'`

### Vehicles Service — `vehicles.test.ts`

Tests the `vehiclesService` business logic with a mocked repository layer.

| # | Test Case | Status | Time |
|---|-----------|--------|------|
| 1 | creates a vehicle | ✅ Pass | 61 ms |
| 2 | throws 404 when updating a vehicle that does not exist | ✅ Pass | 113 ms |
| 3 | throws 404 when deleting a vehicle that does not exist | ✅ Pass | 3 ms |
| 4 | decrements quantity on a successful purchase | ✅ Pass | 2 ms |
| 5 | throws a 409 conflict when quantity is already zero | ✅ Pass | 2 ms |
| 6 | throws a 404 when the vehicle does not exist at all | ✅ Pass | 2 ms |
| 7 | increments quantity on restock | ✅ Pass | 4 ms |
| 8 | rejects a non-positive restock amount | ✅ Pass | 27 ms |

---

## Integration Test Results

> **Command:** `dotenv -e .env.test -- jest --runInBand --testPathPatterns=integration --verbose`  
> **Duration:** 11.894 s · **Suites:** 2 passed · **Tests:** 11 passed

### Auth Endpoints — `auth.integration.test.ts`

Full HTTP round-trip tests against a real PostgreSQL database.

| # | Endpoint | Test Case | Expected Status | Status | Time |
|---|----------|-----------|-----------------|--------|------|
| 1 | `POST /api/auth/register` | registers a new user and returns 201 | `201` | ✅ Pass | 365 ms |
| 2 | `POST /api/auth/register` | returns 409 for a duplicate email | `409` | ✅ Pass | 212 ms |
| 3 | `POST /api/auth/register` | returns 400 for an invalid payload | `400` | ✅ Pass | 62 ms |
| 4 | `POST /api/auth/login` | logs in and returns a JWT | `200` | ✅ Pass | 279 ms |
| 5 | `POST /api/auth/login` | returns 401 for wrong password | `401` | ✅ Pass | 290 ms |

### Vehicles Endpoints — `vehicles.integration.test.ts`

Full CRUD + business-logic tests with role-based access control verification.

| # | Endpoint | Test Case | Expected Status | Status | Time |
|---|----------|-----------|-----------------|--------|------|
| 1 | `POST /api/vehicles` | rejects unauthenticated create | `401` | ✅ Pass | 1175 ms |
| 2 | `GET /api/vehicles` | allows an authenticated user to list vehicles | `200` | ✅ Pass | 803 ms |
| 3 | `POST /api/vehicles/:id/purchase` | lets a non-admin purchase but not delete | `200` / `403` | ✅ Pass | 815 ms |
| 4 | `POST /api/vehicles/:id/purchase` | returns 409 when purchasing out-of-stock vehicle | `409` | ✅ Pass | 719 ms |
| 5 | `POST /api/vehicles/:id/restock` | lets an admin restock and a user cannot | `200` / `403` | ✅ Pass | 648 ms |
| 6 | `GET /api/vehicles/search` | searches by make and price range | `200` | ✅ Pass | 715 ms |

---

## Test Coverage by Feature

The table below maps business features to their test coverage:

| Feature | Unit Tests | Integration Tests | Covered? |
|---------|-----------|-------------------|----------|
| User Registration | ✅ 2 tests | ✅ 3 tests | ✅ Full |
| User Login / JWT | ✅ 3 tests | ✅ 2 tests | ✅ Full |
| Vehicle CRUD (Create) | ✅ 1 test | ✅ 1 test | ✅ Full |
| Vehicle CRUD (List) | — | ✅ 1 test | ✅ Integration |
| Vehicle CRUD (Update) | ✅ 1 test | — | ⚠️ Unit only |
| Vehicle CRUD (Delete) | ✅ 1 test | ✅ 1 test (via RBAC) | ✅ Full |
| Purchase (stock decrement) | ✅ 2 tests | ✅ 2 tests | ✅ Full |
| Restock (stock increment) | ✅ 2 tests | ✅ 1 test | ✅ Full |
| Search / Filtering | — | ✅ 1 test | ✅ Integration |
| RBAC (role-based access) | — | ✅ 3 tests | ✅ Integration |
| Input Validation (Zod) | — | ✅ 1 test | ✅ Integration |
| Rate Limiting | — | — | ⚠️ Not tested |

---

## API Endpoints Tested

All endpoints exercised during integration testing:

```
POST   /api/auth/register          → 201, 400, 409
POST   /api/auth/login             → 200, 401
GET    /api/vehicles               → 200
POST   /api/vehicles               → 201, 401
DELETE /api/vehicles/:id           → 403
POST   /api/vehicles/:id/purchase  → 200, 409
POST   /api/vehicles/:id/restock   → 200, 403
GET    /api/vehicles/search        → 200
```

---

## Recommendations

### Areas for Improvement

1. **Add coverage reporting** — Run `npm run test:coverage` and track line/branch/function coverage thresholds.
2. **Vehicle Update integration test** — The `PUT /api/vehicles/:id` endpoint is covered at the unit level but not integration level.
3. **Rate limiting tests** — The rate limiter middleware (200 req/15 min) has no dedicated test; consider adding a stress test.
4. **Error handler tests** — The global `errorHandler` middleware is indirectly tested but could benefit from explicit edge-case tests (e.g., unexpected exceptions).
5. **Search edge cases** — Add integration tests for empty results, partial filters, and boundary price values.

---

## How to Reproduce

```powershell
# Run unit tests
cd d:\car-dealership-inventory\server
npm test

# Run integration tests (requires PostgreSQL configured in .env.test)
npm run test:integration

# Run all tests
npm run test:all
```

> **⚠️ Important:** Integration tests require a running PostgreSQL instance configured via `server/.env.test`. The test setup truncates all tables before each test — **never point `.env.test` at a production database**.
