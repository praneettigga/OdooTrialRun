auth.users           Supabase handles authentication
    │
    └── profiles
          │
          └── products
                │
                ├── cart_items
                │
                └── order_items
                       │
                     orders

┌──────────────────────┐
│      auth.users      │
│   Supabase managed   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       profiles       │
├──────────────────────┤
│ id                   │
│ username             │
│ avatar_url           │
│ created_at           │
└──────────┬───────────┘
           │ seller_id
           ▼
┌──────────────────────┐
│       products       │
├──────────────────────┤
│ id                   │
│ seller_id            │
│ title                │
│ description          │
│ category             │
│ price                │
│ image_url            │
│ status               │
│ condition            │
│ created_at           │
└──────┬─────────┬─────┘
       │         │
       │         │
       ▼         ▼
┌────────────┐  ┌────────────────┐
│ cart_items │  │  order_items   │
├────────────┤  ├────────────────┤
│ user_id    │  │ id             │
│ product_id │  │ order_id       │
│ added_at   │  │ product_id     │
└────────────┘  │ title_snapshot │
                │ price_snapshot │
                │ image_snapshot │
                └───────┬────────┘
                        ^
                        │
                        |
                ┌────────────────┐
                │     orders     │
                ├────────────────┤
                │ id             │
                │ buyer_id       │
                │ total_amount   │
                │ status         │
                │ created_at     │
                └────────────────┘


category
roles: customers(who are also ), admin

condition: Like new | Good | Well used
  Added for the landing page's condition filter and card badge. The Round 1
  wireframe lists Condition on the Add Product screen.
