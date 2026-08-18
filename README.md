# EcoFinds

Sustainable second-hand marketplace — hackathon build, trial run 2, four
teammates. See `docs/HACKATHON_PLAN.md` for the full operating manual.

## Team

| Lane | Owner |
|---|---|
| Integrator (`main`) | Armaan |
| Backend / data layer | Praneet |
| Page builder | Pooja |
| Page builder | Athira |

## Stack

React 18 · TypeScript · Vite · Tailwind · React Router v6 · Supabase · Vercel

## Setup

```bash
cd frontend
npm install
cp .env.example .env.local   # fill in Supabase URL + anon key
npm run dev
```

## Backend baseline

`frontend/src/types/database.ts` is generated from the linked Supabase project's
`public` schema. Regenerate it after every applied migration:

```bash
supabase gen types typescript --project-id pqtvutqrovpwhekllbow --schema public > frontend/src/types/database.ts
```

The backend owner must also create one ordinary dev user in **Supabase Dashboard
→ Authentication → Users** and use it to verify protected routes. Keep its
credentials out of the repository; this app has no service-role key in the
frontend.

## Repo shape

```
frontend/src/   React app — components/, pages/, services/ (all Supabase access)
backend/supabase/   migrations/, seed.sql
docs/   SCHEMA.md, SERVICES.md, TASKS.md, AUTH.md, DESIGN.md, HACKATHON_PLAN.md
```
