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
cp .env.example .env   # fill in Supabase URL + anon key
npm run dev
```

## Repo shape

```
frontend/src/   React app — components/, pages/, services/ (all Supabase access)
backend/supabase/   migrations/, seed.sql
docs/   SCHEMA.md, SERVICES.md, TASKS.md, AUTH.md, DESIGN.md, HACKATHON_PLAN.md
```
