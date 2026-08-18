# Auth

- Public routes are `/`, `/login`, and `/signup`.
- Login accepts email and password, then returns the user to `/` with the
  Supabase session persisted in browser storage.
- Sign-up sends email, password, and username. The `auth.users` trigger creates
  the matching `profiles` row.
- With email confirmation enabled, users confirm their email then log in. If it
  is disabled, the new session is available immediately.
