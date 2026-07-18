- **Auth**: JWT-based; `authenticate` middleware verifies tokens, `authorize('admin')` gates admin-only routes.
- **Data layer**: no ORM — every table access lives in a `*.repository.ts` file using parameterized SQL, keeping services free of SQL and easy to unit-test with mocks.
- **Concurrency safety**: vehicle purchases use a single atomic `UPDATE ... WHERE quantity > 0` statement, so stock can never go negative under concurrent requests.

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (managed locally via pgAdmin)

### Database
1. In pgAdmin, create two databases: `car_dealership` and `car_dealership_test`.
2. Run `server/db/migrations/001_init.sql` against both (Query Tool → paste → Execute).
3. Run `server/db/seed.sql` against `car_dealership` only (generates sample vehicles + an admin user).

### Backend

cd server
npm install
cp .env.example .env   # fill in your DATABASE_URL, JWT_SECRET
npm run dev             # http://localhost:4000
```

### Frontend

cd client
npm install
cp .env.example .env   # points VITE_API_URL at the backend
npm run dev             # http://localhost:5173
```

## Running Tests


# Backend
cd server
npm run test              # unit tests (mocked repositories)
npm run test:integration  # integration tests against car_dealership_test
npm run test:coverage

# Frontend
cd client
npm run test
```

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create an account |
| POST | `/api/auth/login` | — | Get a JWT |
| GET | `/api/vehicles` | User | List all vehicles |
| GET | `/api/vehicles/search` | User | Filter by make/model/category/price range |
| POST | `/api/vehicles` | User | Add a vehicle |
| PUT | `/api/vehicles/:id` | User | Update a vehicle |
| DELETE | `/api/vehicles/:id` | Admin | Delete a vehicle |
| POST | `/api/vehicles/:id/purchase` | User | Decrement quantity by 1 |
| POST | `/api/vehicles/:id/restock` | Admin | Increment quantity |

## My AI Usage

**Tools used:** Claude (Anthropic), used throughout frontend build.

**How I used it:**
- Brainstormed the initial module layout (controller/service/repository split for the backend; pages/components/hooks/api layers for the frontend) before writing any code.
- Generated first-pass boilerplate for repetitive layers — the repository SQL methods, the zod schemas, the Express route wiring — which I then reviewed and adjusted (parameter binding, error codes, edge cases like the search route ordering before `:id`).
- Used it to draft the Jest/Supertest unit and integration test scaffolding (mocked-repository unit tests, then real-DB integration tests with a reset helper), which enforced writing tests before implementation (Red-Green-Refactor).
- Asked it to help design the atomic `UPDATE ... WHERE quantity > 0` purchase query specifically to avoid a race condition on concurrent purchases, and verified that behavior manually with a concurrent-curl test.
- Used it for the Tailwind design pass — picking a non-default color palette and type scale so the UI didn't look like default Tailwind output.

**Reflection:** AI assistance was most valuable for scaffolding — getting a consistent, correctly-typed skeleton across many small files quickly — and for catching things I might not have thought to test up front, like the out-of-stock/not-found split in the purchase flow and the concurrency edge case. It was least useful as a substitute for actually understanding the SQL and auth flow; I still had to trace through and verify the atomic update logic, the JWT middleware order, and the admin-guard placement myself, since those are exactly the places where a subtly wrong suggestion would be hard to catch later. Net effect: faster on boilerplate and test scaffolding, but the architectural decisions and correctness-critical logic (auth, concurrency, validation) still required my own review line by line.
EOF