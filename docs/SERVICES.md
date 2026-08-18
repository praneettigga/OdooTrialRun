# Services

The backend/frontend contract. Everything the frontend may call lives in
`frontend/src/services/`. **Pages never import Supabase, and never import
`fixtures/` directly** — they call these functions.

> **Status.** Product and profile services are live. Cart and order functions remain stubs over
> `frontend/src/fixtures/`, at the signature the real Supabase implementation
> will use. Replace the bodies, keep the exports, and no page changes. Each file
> is self-contained so they can be swapped one at a time (plan §8, Stage 4).
>
> **`auth.ts` and `supabase.ts` are also real**, written by
> the backend lane and talking to Supabase today.
>
> Stubs carry a deliberate 150–600ms delay. Without it the loading branches never
> render and cannot be tested (plan §12).

---

## `services/supabase.ts`

| Function | Signature | Notes |
|---|---|---|
| `getSupabase` | `() => SupabaseClient` | Lazily creates one client. Throws a readable error if `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are missing. |

**This is the only module allowed to construct a Supabase client.** Everything
else — pages included — goes through a service.

## `services/auth.ts`

**Real, not a stub.** Owned by the backend lane.

| Function | Signature | Notes |
|---|---|---|
| `signIn` | `(email, password) => Promise<{ error: string \| null }>` | Email/password session. Supabase persists it in browser storage. |
| `signUp` | `(email, password, username) => Promise<{ error: string \| null; hasSession: boolean }>` | `username` rides in user metadata; the `auth.users` trigger creates the `profiles` row. `hasSession` is false when email confirmation is on. |

See `docs/AUTH.md` for the routing contract.

## `services/products.ts`

Also re-exports `CATEGORIES`, `CONDITIONS`, `CURRENT_USER_ID` and the
`Listing` / `Category` / `Condition` / `ListingStatus` types, so pages have one
import for listing work.

| Function | Signature | Notes |
|---|---|---|
| `listListings` | `(filters?: ListingFilters) => Promise<Listing[]>` | The one read used by Marketplace, My Listings and "more from this seller". |
| `getListing` | `(id: string) => Promise<Listing \| null>` | `null` means gone — callers render the removed-listing state, not an error. |
| `createListing` | `(input: ListingInput) => Promise<Listing>` | Seller is the current user. |
| `updateListing` | `(id: string, input: ListingInput) => Promise<Listing>` | Throws if the listing vanished. |
| `deleteListing` | `(id: string) => Promise<void>` | Throws if the listing vanished. |
| `markSold` | `(ids: string[]) => Promise<void>` | Called by checkout. Not for page use. |

```ts
type ListingFilters = {
  query?: string          // matches title, per the Round 1 keyword-search brief
  categories?: Category[]
  conditions?: Condition[]
  minPrice?: number
  maxPrice?: number
  sellerId?: string
  status?: ListingStatus | 'any'   // defaults to 'available'
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'title'
}

type ListingInput = {
  title: string
  description: string
  category: Category
  price: number
  stockQuantity: number
  condition: Condition
  status: ListingStatus
}
```

**`status` defaults to `'available'`.** Public browsing must not surface drafts.
My Listings passes `status: 'any'` because it is the seller's own view. This
mirrors the RLS split that `docs/SCHEMA.md` will need.

## `services/cart.ts`

| Function | Signature | Notes |
|---|---|---|
| `getCart` | `() => Promise<CartLine[]>` | Drops lines whose listing disappeared rather than throwing. |
| `getCartCount` | `() => Promise<number>` | Header badge. Sums quantities. |
| `addToCart` | `(productId: string) => Promise<void>` | Increments if already present — matches the `(user_id, product_id)` primary key. |
| `setQuantity` | `(productId: string, quantity: number) => Promise<void>` | `0` or less removes the line. |
| `removeFromCart` | `(productId: string) => Promise<void>` | |
| `clearCart` | `() => Promise<void>` | Called by checkout. |

`CartLine` is `{ listing: Listing; quantity: number }` — the join is done in the
service so pages never assemble it.

## `services/orders.ts`

| Function | Signature | Notes |
|---|---|---|
| `listOrders` | `() => Promise<Order[]>` | Newest first. Previous Purchases. |
| `getOrder` | `(id: string) => Promise<Order \| null>` | |
| `placeOrder` | `() => Promise<Order>` | Checkout. Throws on an empty cart. |

`placeOrder` does three writes and the real version must wrap them in a
transaction: create the order with **price snapshots**, mark the listings sold,
empty the cart. Purchases renders snapshots, never the live listing, so a past
order still reads correctly after a seller edits or deletes the item.

## `services/profile.ts`

**Real.** Reads and updates the `profiles` row belonging to the authenticated
user; email comes from Supabase Auth and remains read-only.

| Function | Signature | Notes |
|---|---|---|
| `getProfile` | `() => Promise<Profile>` | |
| `updateProfile` | `(input: ProfileInput) => Promise<Profile>` | Throws on a username under 2 characters, matching the schema check. |

`ProfileInput` is `{ username: string; avatarUrl: string | null }` — the only
columns the `profiles` migration grants a user (`grant update (username,
avatar_url)`). Email is Supabase-managed on `auth.users` and is read-only in the
UI.

The migration checks `char_length(btrim(username)) between 2 and 40` and does
**not** make username unique, so there is no 23505 to handle. If we later want
usernames to be unique, that is a schema change first.
