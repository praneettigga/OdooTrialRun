# Services

`frontend/src/services/auth.ts` is the frontend contract for Supabase Auth.

| Function | Contract |
|---|---|
| `signUp(email, password, username)` | Creates the account and passes username to the profile trigger. |
| `signIn(email, password)` | Starts an email/password session. |

Pages must call this service rather than importing the Supabase client directly.
