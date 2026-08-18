with dev_seller as (
  select id from public.profiles order by created_at asc limit 1
), seed_products (
  id, title, description, category, price, stock_quantity, condition, status
) as (
  values
    ('00000000-0000-4000-8000-000000000001'::uuid, 'Teak writing desk with drawer', 'Solid teak, freshly oiled, with one drawer that closes flush. Collection from Indiranagar.', 'Furniture', 6400.00, 1, 'Good', 'available'),
    ('00000000-0000-4000-8000-000000000002'::uuid, 'Sony MDR-7506 studio headphones', 'Earpads were replaced last year, cable is intact, and the drawstring pouch is included.', 'Electronics', 4800.00, 2, 'Like new', 'available'),
    ('00000000-0000-4000-8000-000000000003'::uuid, 'Pre-seasoned cast iron kadai', 'A heavy ten-inch kadai seasoned over two years of daily use and ready for another kitchen.', 'Kitchen', 1250.00, 1, 'Good', 'available'),
    ('00000000-0000-4000-8000-000000000004'::uuid, 'Penguin Classics twelve-book set', 'Mixed Russian and French titles with creased spines but clean pages and no markings inside.', 'Books', 2100.00, 1, 'Well used', 'available'),
    ('00000000-0000-4000-8000-000000000005'::uuid, 'Handloom linen kurta size M', 'Natural undyed linen worn four times, softened with washing and lightly faded at the collar.', 'Clothing', 900.00, 3, 'Like new', 'available'),
    ('00000000-0000-4000-8000-000000000006'::uuid, 'Cork yoga mat four millimetres', 'Cork over natural rubber, cleaned and aired, with dependable grip for home practice.', 'Sports', 1600.00, 1, 'Good', 'available')
)
insert into public.products (
  id, seller_id, title, description, category, price, stock_quantity, condition, status
)
select
  seed_products.id,
  dev_seller.id,
  seed_products.title,
  seed_products.description,
  seed_products.category,
  seed_products.price,
  seed_products.stock_quantity,
  seed_products.condition,
  seed_products.status
from seed_products cross join dev_seller
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  price = excluded.price,
  stock_quantity = excluded.stock_quantity,
  condition = excluded.condition,
  status = excluded.status;
