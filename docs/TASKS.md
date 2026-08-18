# Tasks

Claimed by name, first to claim owns it. Ticked in the same push as the work.
See `docs/HACKATHON_PLAN.md` §9 for tier rules — don't start a tier until the
one above is genuinely done.

## Tier 1 — the demo dies without these

- [ ] Supabase schema: users, products, seed data — **Praneet**
- [ ] RLS policies, tested against the dev account — **Praneet**
- [ ] Seeded dev account (Stage 2 exit criterion, plan §6) — **Praneet**
- [ ] Generated `types/database.ts` — **Praneet**
- [ ] `services/auth.ts` — sign in / sign up / session — **Praneet**
- [x] Design tokens in `docs/DESIGN.md`, live in `@theme` — **Armaan**
- [x] Landing page — search, categories, sort/filter/group, listings — **Armaan**
- [x] Login page — validation, loading, error states — **Armaan**
- [ ] Sign-up page — _unclaimed_
- [ ] Product detail view — _unclaimed_
- [ ] Create / edit / delete a listing (My Listings) — _unclaimed_
- [ ] User dashboard (edit profile fields) — _unclaimed_

## Tier 2 — what makes it competitive

- [x] Category filtering (client-side, on fixtures) — **Armaan**
- [x] Keyword search by title, with live count and 0-found state — **Armaan**
- [ ] Cart — _unclaimed_
- [ ] Previous purchases view — _unclaimed_

## Tier 3 — only if 1 and 2 are polished

- _none yet — problem statement is Round 1 scope only_

---

## Deferred deliberately

Left out rather than shipped dead. DESIGN.md: "Don't ship a dead control."

- **Header cart icon + badge** (in the wireframe) — needs the cart page. Add with Cart.
- **Header profile avatar** (in the wireframe) — needs the dashboard. Add with User dashboard.
- **Hamburger links to My Listings / Add Product / About / Contact** — the menu
  currently carries only routes that exist. Extend as each page lands.
- **Sign-up link on the login page** — needs the sign-up page. One line to add.

## Wiring notes for the backend lane

- `LoginPage.tsx` calls a local `signIn(identifier, password)` stub at the real
  signature. Replace the import with `services/auth` — the call site is unchanged.
  It fails closed today: no fake session, no fake user object (plan §6).
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
