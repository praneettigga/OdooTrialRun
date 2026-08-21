# Auth

- Public routes are `/`, `/login`, `/signup`, and `/reset-password`; all app
  routes require a resolved Supabase session and redirect signed-out visitors to
  `/login`.
- `/login` and `/signup` are two paths onto **one mounted `AuthPage`**, wired as a
  layout route. Separate route elements would remount the component on every
  switch, resetting the flag that gates its slide transition. The visible panel is
  derived from the path, so Back and refresh both behave.
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
- **Password recovery.** "Forgot password?" on the login panel emails a link via
  `requestPasswordReset`, using the address already typed into the form. The link
  lands on `/reset-password`, where supabase-js exchanges the token itself
  (`detectSessionInUrl` is on by default) and `AuthProvider` picks the session up
  through `onAuthStateChange` — nothing hand-parses the URL, so the PKCE and
  hash-fragment flows both work. A session on that page therefore means the link
  was valid; its absence means expired or already used. After `updatePassword`
  succeeds the visitor is **already signed in**, so they go to `/`, not `/login`.
- The `redirectTo` target must be listed under **Supabase → Authentication → URL
  Configuration → Redirect URLs**, or the emailed link dead-ends. Needs both the
  local origin and the production origin once that exists.
