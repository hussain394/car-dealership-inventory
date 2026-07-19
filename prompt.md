# AI Prompts Used During Development

---

## Prompt 1 — Concurrency-safe purchase logic

> My vehicle purchase endpoint currently does a SELECT to check quantity, then a separate UPDATE to decrement it. Two users hitting `/api/vehicles/:id/purchase` at the same time can both read quantity = 1 and both succeed, leaving stock at -1. How do I fix this race condition without wrapping it in an explicit transaction or using advisory locks? I'm using raw SQL with node-postgres, no ORM.

**Outcome:** Got the single atomic query pattern — `UPDATE vehicles SET quantity = quantity - 1 WHERE id = $1 AND quantity > 0 RETURNING *`. If `RETURNING *` gives zero rows, the vehicle is either missing or sold out. I split the two cases in my service layer: first check if the vehicle exists (404), then attempt the atomic decrement (409 if no rows returned). This replaced ~15 lines of SELECT-then-UPDATE logic with a single statement that's inherently safe under concurrency.

---

## Prompt 2 — Dynamic WHERE clause builder for search filters

> I need to build a search endpoint where all filters are optional — make, model, category, minPrice, maxPrice. The user might pass any combination. Write me a clean pattern for dynamically constructing the WHERE clause with parameterized queries in node-postgres. I don't want string interpolation anywhere near the values.

**Outcome:** Got a clause-accumulator pattern that pushes `$N` placeholders and values in lockstep. I adapted it into my `vehicles.repository.ts` search method. One thing I caught during review: the AI's version used `=` for make/model matching — I changed it to `ILIKE` with `%` wrapping so partial searches work (e.g., searching "Toy" matches "Toyota").

---

## Prompt 3 — Express route ordering bug

> My `GET /api/vehicles/search?make=Toyota` is returning a 500 with "invalid input syntax for type integer" from Postgres. It's hitting the `findById` repository method instead of the search handler. Both routes are registered on the same router. Why is Express matching `/search` as an `:id` param?

**Outcome:** The issue was that `router.get('/:id', ...)` was declared *before* `router.get('/search', ...)`, so Express matched "search" as the `:id` value and tried to parse it as an integer. Moved the `/search` route above all `/:id` routes and added a comment so I don't accidentally reorder them later.

---

## Prompt 4 — Mocking the repository layer in unit tests

> I have a `vehiclesService` that depends on `vehiclesRepository`. I want to unit test the service in isolation — mock the entire repository module so no DB calls happen. I'm using Jest with TypeScript. What's the cleanest way to mock a module-level object and get full type safety on the mocked methods?

**Outcome:** Used `jest.mock('./vehicles.repository')` at the top level, then cast the import as `jest.Mocked<typeof vehiclesRepository>` to get autocomplete on `.mockResolvedValue()`. This let me test all the edge cases in the purchase flow — successful decrement, 409 when out of stock, 404 when vehicle doesn't exist — without touching the database. I added `beforeEach(() => jest.clearAllMocks())` to avoid state leaking between tests, which the AI's initial version was missing.

---

## Prompt 5 — Extending Express Request with JWT payload type

> I'm attaching `{ userId, role }` to `req.user` after JWT verification in my authenticate middleware. TypeScript complains because `Request` doesn't have a `user` property. I don't want to use `as any`. What's the right way to extend the Request type so downstream controllers can access `req.user` with full type safety?

**Outcome:** Created an `AuthenticatedRequest` interface extending `Request` with an optional `user` field. The middleware sets it, and controllers that need it type their `req` parameter as `AuthenticatedRequest`. Considered the alternative of augmenting the global `Express.Request` via declaration merging, but decided against it — not every route needs auth, so an explicit interface makes it clear which handlers expect a logged-in user.

---

## Prompt 6 — Debouncing filter inputs without spamming the API

> I have a VehicleFilters component with four inputs (make, category, minPrice, maxPrice). Each keystroke triggers a re-render and I need to call the search API only after the user stops typing. Should I use a custom `useDebounce` hook on each value, or is there a simpler pattern with `useEffect` + `setTimeout`?

**Outcome:** Went with a single `useEffect` that watches all four filter values and sets a 300ms `setTimeout`, returning `clearTimeout` as the cleanup. Simpler than four separate debounce hooks and gives one consolidated API call when the user pauses. The filter object gets passed to my `useVehicles` hook as a query key, so TanStack Query automatically refetches when the debounced values change.

---

## Prompt 7 — Custom Tailwind theme instead of default palette

> How do I register a custom color palette and custom fonts in `tailwind.config.js`? I want a green-toned brand scale for buttons/accents, an off-white canvas background, Inter for body, and a serif display font (Fraunces). Also want the `@tailwindcss/forms` plugin for styled inputs.

**Outcome:** Extended the theme with a `brand` color scale (50–900), a `canvas` shorthand color, and `fontFamily` entries for `sans` and `display`. Plugged in `@tailwindcss/forms` and set `body` to `bg-canvas font-sans antialiased` in `index.css`. Looked clean out of the box.

---

## Prompt 8 — Vite config with Vitest in the same file

> Can I run Vitest without a separate `vitest.config.ts`? I want the test config (jsdom environment, setup file, globals) inside my existing `vite.config.ts` so there's one config file for both dev server and tests.

**Outcome:** Changed the import from `vite` to `vitest/config` — the `defineConfig` from `vitest/config` accepts a `test` block alongside the standard Vite options. One file handles both `npm run dev` and `npm run test`.

---

## Prompt 9 — ProtectedRoute wrapper with role-based access

> I need a React Router layout route that redirects to `/login` if the user isn't authenticated. It should also accept an `adminOnly` prop — if true, redirect non-admin users back to `/`. I'm using an `AuthContext` that exposes `{ user, token }` where `user` has a `role` field.

**Outcome:** Built a `ProtectedRoute` component that renders `<Outlet />` if authorized, otherwise `<Navigate to="..." />`. Used it in `App.tsx` as a wrapper: regular routes nested under `<ProtectedRoute />`, admin routes under `<ProtectedRoute adminOnly />`.

