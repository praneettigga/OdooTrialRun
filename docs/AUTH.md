# Auth

- Public routes are `/`, `/login`, and `/signup`; all app routes require a
  resolved Supabase session and redirect signed-out visitors to `/login`.
- Login accepts email and password, then returns the user to the protected route
  they requested (or `/` when they arrived directly) with the
  Supabase session persisted in browser storage. `AuthProvider` reads that
  session on load and subscribes to auth changes, so the landing header swaps
  its login/sign-up controls for Dashboard and Log out immediately after login
  (and restores them after logout).
- Sign-up sends email, password, and username. The `auth.users` trigger creates
  the matching `profiles` row.
- With email confirmation enabled, users confirm their email then log in. If it
  is disabled, the new session is available immediately.
