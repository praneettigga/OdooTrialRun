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
