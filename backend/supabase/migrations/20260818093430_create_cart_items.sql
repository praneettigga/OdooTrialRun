create table public.cart_items (
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity integer not null check (quantity > 0),
  added_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create index cart_items_product_id_idx on public.cart_items (product_id);

alter table public.cart_items enable row level security;

create policy "Users can read their own cart items"
on public.cart_items for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Users can add valid items to their own cart"
on public.cart_items for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.products
    where products.id = cart_items.product_id
      and products.seller_id <> (select auth.uid())
      and products.status = 'available'
      and products.stock_quantity >= cart_items.quantity
  )
);

create policy "Users can update valid items in their own cart"
on public.cart_items for update
to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.products
    where products.id = cart_items.product_id
      and products.seller_id <> (select auth.uid())
      and products.status = 'available'
      and products.stock_quantity >= cart_items.quantity
  )
);

create policy "Users can remove their own cart items"
on public.cart_items for delete
to authenticated
using (user_id = (select auth.uid()));

grant select, insert, update, delete on public.cart_items to authenticated;
