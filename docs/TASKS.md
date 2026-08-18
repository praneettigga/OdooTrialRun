# Tasks

Claimed by name, first to claim owns it. Ticked in the same push as the work.
See `docs/HACKATHON_PLAN.md` §9 for tier rules — don't start a tier until the
one above is genuinely done.

## Tier 1 — the demo dies without these

- [x] Supabase schema: profiles (products and seed data remain) — **Praneet**
- [x] RLS policies for profiles (manual dev-account test pending) — **Praneet**
- [ ] Seeded dev account (Stage 2 exit criterion, plan §6) — **Praneet**
- [x] Generated `types/database.ts` from the linked project — **Praneet**
- [x] `services/auth.ts` — sign in / sign up / session — **Praneet**
- [x] Design tokens in `docs/DESIGN.md`, live in `@theme` — **Armaan**
- [x] Landing page — search, categories, sort/filter/group, listings — **Armaan**
- [x] Login page — validation, loading, error states — **Armaan**, wired to real auth by **Praneet**
- [x] Sign-up page — **Praneet**
- [x] Product detail view — **Armaan**
- [x] Create / edit / delete a listing (My Listings) — **Armaan**
- [x] Products schema and live catalogue/listing service with stock — **Praneet**
- [x] Live profile service and in-app sign out — **Praneet**
- [x] Cart schema and live stock-limited cart service — **Praneet**
- [x] Atomic checkout, orders, and purchase history service — **Praneet**
- [x] User dashboard (edit profile fields) — **Armaan**

## Tier 2 — what makes it competitive

- [x] Category filtering (client-side, on fixtures) — **Armaan**
- [x] Keyword search by title, with live count and 0-found state — **Armaan**
- [x] Cart, with quantity and checkout — **Armaan**
- [x] Previous purchases view — **Armaan**
- [x] Marketplace — full searchable catalogue with facets — **Armaan**

## Tier 3 — only if 1 and 2 are polished

- _none yet — problem statement is Round 1 scope only_

---

## Deferred deliberately

Left out rather than shipped dead. DESIGN.md: "Don't ship a dead control."

- ~~Header cart icon + badge~~ — **shipped** in `AppHeader` now that `/cart` exists.
- ~~Header profile avatar~~ — **shipped** in `AppHeader` now that `/dashboard` exists.
- **Sign-up link on the login page** — still needs the sign-up page. One line to add.
- **Landing header has no link to `/marketplace`.** Still not added — the
  landing lane owns `Header.tsx`. One line for whoever owns it: add
  `{ href: '/marketplace', label: 'Marketplace' }` to `LINKS`. The footer now
  links there from every page, so it is reachable in the meantime.
- **Pagination on the marketplace.** 24 listings render fine in one pass; add it
  when the catalogue is big enough to need it.

## Wiring notes for the backend lane

- ~~`LoginPage.tsx` calls a local `signIn` stub~~ — **done.** Praneet swapped it
  for `services/auth`, and the call site did not change, which is what the
  stub-at-the-real-signature approach was for.
- `fixtures/products.ts` is shaped to the fields the Round 1 wireframe documents
  for a listing. It is **not** a schema proposal — `docs/SCHEMA.md` is Praneet's
  to write, and the fixture follows it once it exists.

## Open — reconcile with `docs/DESIGN.source.md`

The uploaded style reference landed mid-build. Its palette hexes are identical to
the shipped `@theme`; two policy points differ and are **not** yet applied:

- [ ] **Primary CTA colour.** The source says Forest Ink `#163300` is the dominant
      brand dark and "do not promote [lime] to the primary CTA color". Shipped
      today: lime CTA on neutral surfaces, ink CTA on the lime band. Decide which
      wins, then update `DESIGN.md`, `@theme`, and `Button.tsx` together.
- [ ] **Display face.** The source names *Inter Black 900 at -0.04em* as the Wise
      Sans substitute. Shipped today: Manrope 800 (also sanctioned by the DesignMD
      catalog entry). One-line change in `index.css` if we switch.
- [ ] **Unused source colours** — Signal Blue `#0b4c72`, Alarm Red `#cb272f`,
      Spruce `#054d28`, Slate `#6a6c6a`. Add to `@theme` only when a screen needs them
      (`check:tokens` fails on tokens documented but not live, and vice versa).

## Open — fixture vs Praneet's schema

`docs/SCHEMA.md` (Praneet) landed on the remote while Stage 2 was being built, so
the landing page fixture does not match it yet. Reconcile before Stage 4 wiring:

- [x] **`condition`** — added to `docs/SCHEMA.md` (`Like new` / `Good` / `Well used`).
      The landing page's filter and card badge now match the schema.
- [x] **`year`** — removed from the fixture. Nothing rendered it.
- `seller` is a display string in the fixture; the schema has **`seller_id` →
  `profiles.username`**. The card needs the joined username.
- `image_url` exists in the schema — the card currently renders a branded
  placeholder. Swap to the real image when listings carry one.
- Fixture keeps `listedDaysAgo` for "newest first"; the schema's `created_at`
  is the real sort key.

## Open — Stage 4 wiring

- [x] Replace `services/*.ts` stub bodies with Supabase calls. Signatures stayed
      fixed; the landing page deliberately remains fixture-backed.
- [x] Wrap `AppLayout` in `ProtectedRoute`; signed-out visitors now return to
      login and resume their requested route after a successful sign-in.
- [ ] **Profile fields.** The wireframe wants a fuller profile than `profiles`
      has columns for. Dashboard edits username only, and shows email read-only
      from auth. Decide the columns before building more of that form.
- [ ] Photo upload. Every listing renders a placeholder until Supabase storage
      is wired; `products.image_url` is already in the schema.

## Merge notes — praneet + athira integration

- `Footer.tsx` linked to `#listings` / `#how`. Those anchors only exist on the
  landing page, and the footer renders on all ten routes via `AppLayout`, so
  they were dead everywhere else. Now points at `/marketplace`, `/sell`,
  `/purchases` — real routes on every page.
- `services/auth.ts` threw instead of returning. `getSupabase()` throws when the
  env vars are missing, and neither `LoginPage` nor `SignupPage` wraps the call,
  so submitting left the button disabled on "Checking…" with nothing on screen.
  Both now surface the message, because the documented contract is
  `Promise<{ error }>`, not a throw.
- `Header.tsx` conflicted (praneet pointed "Start selling" at `/signup`, athira
  restructured the whole header). Resolution keeps athira's layout and praneet's
  `/signup` targets.
- **`ogl` costs +20.8 kB gzip** (106.96 → 127.71 kB) for the hero ripple. Recorded
  per plan §3, which asks for the bundle delta before adopting, not after.
- **The hero ripple is unverified motion.** It renders and does not intercept
  clicks, but a backgrounded automated tab gets zero `requestAnimationFrame`
  callbacks, so whether it *animates* well needs a human at a visible browser
  (plan §12).
