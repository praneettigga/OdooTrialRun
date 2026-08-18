create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(btrim(title)) >= 4),
  description text not null check (char_length(btrim(description)) >= 15),
  category text not null check (category in ('Furniture', 'Electronics', 'Books', 'Clothing', 'Sports', 'Kitchen')),
  price numeric(12,2) not null check (price >= 0 and price <= 10000000),
  stock_quantity integer not null,
  image_url text,
  condition text not null check (condition in ('Like new', 'Good', 'Well used')),
  status text not null default 'available' check (status in ('available', 'sold', 'draft')),
  created_at timestamptz not null default now(),
  check (
    (status in ('available', 'draft') and stock_quantity > 0)
    or (status = 'sold' and stock_quantity = 0)
  )
);

create index products_seller_id_created_at_idx on public.products (seller_id, created_at desc);
create index products_available_created_at_idx
  on public.products (created_at desc)
  where status = 'available' and stock_quantity > 0;

alter table public.products enable row level security;

create policy "Available products are readable by everyone"
on public.products for select
to anon, authenticated
using (
  (status = 'available' and stock_quantity > 0)
  or seller_id = (select auth.uid())
);

create policy "Users can create their own products"
on public.products for insert
to authenticated
with check (seller_id = (select auth.uid()));

create policy "Users can update their own products"
on public.products for update
to authenticated
using (seller_id = (select auth.uid()))
with check (seller_id = (select auth.uid()));

create policy "Users can delete their own products"
on public.products for delete
to authenticated
using (seller_id = (select auth.uid()));

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
