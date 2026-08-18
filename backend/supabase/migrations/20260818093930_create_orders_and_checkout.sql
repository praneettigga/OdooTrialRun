create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles (id),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  status text not null default 'placed' check (status in ('placed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  title_snapshot text not null,
  price_snapshot numeric(12,2) not null check (price_snapshot >= 0),
  category_snapshot text not null,
  image_url_snapshot text,
  quantity integer not null check (quantity > 0)
);

create index orders_buyer_id_created_at_idx on public.orders (buyer_id, created_at desc);
create index order_items_order_id_idx on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Buyers can read their own orders"
on public.orders for select
to authenticated
using (buyer_id = (select auth.uid()));

create policy "Buyers can read their own order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.buyer_id = (select auth.uid())
  )
);

grant select on public.orders, public.order_items to authenticated;

create function public.place_order()
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_buyer_id uuid := auth.uid();
  v_order_id uuid;
  v_total numeric(12,2) := 0;
  v_line_count integer := 0;
  v_line record;
begin
  if v_buyer_id is null then
    raise exception 'Sign in to place an order.';
  end if;

  -- Lock cart and product rows in product order. The locks persist until the
  -- function transaction finishes, so price and stock cannot change mid-order.
  for v_line in
    select
      ci.product_id,
      ci.quantity,
      p.seller_id,
      p.status,
      p.stock_quantity,
      p.price
    from public.cart_items as ci
    join public.products as p on p.id = ci.product_id
    where ci.user_id = v_buyer_id
    order by ci.product_id
    for update of ci, p
  loop
    v_line_count := v_line_count + 1;

    if v_line.seller_id = v_buyer_id then
      raise exception 'You cannot purchase your own listing.';
    end if;

    if v_line.status <> 'available' or v_line.stock_quantity < v_line.quantity then
      raise exception 'A cart item is no longer available in the requested quantity.';
    end if;

    v_total := v_total + (v_line.price * v_line.quantity);
  end loop;

  if v_line_count = 0 then
    raise exception 'Your cart is empty.';
  end if;

  insert into public.orders (buyer_id, total_amount)
  values (v_buyer_id, v_total)
  returning id into v_order_id;

  insert into public.order_items (
    order_id,
    product_id,
    title_snapshot,
    price_snapshot,
    category_snapshot,
    image_url_snapshot,
    quantity
  )
  select
    v_order_id,
    p.id,
    p.title,
    p.price,
    p.category,
    p.image_url,
    ci.quantity
  from public.cart_items as ci
  join public.products as p on p.id = ci.product_id
  where ci.user_id = v_buyer_id;

  update public.products as p
  set
    stock_quantity = p.stock_quantity - ci.quantity,
    status = case
      when p.stock_quantity - ci.quantity = 0 then 'sold'
      else 'available'
    end
  from public.cart_items as ci
  where ci.user_id = v_buyer_id
    and p.id = ci.product_id;

  delete from public.cart_items where user_id = v_buyer_id;

  return v_order_id;
end;
$$;

revoke all on function public.place_order() from public, anon;
grant execute on function public.place_order() to authenticated;
