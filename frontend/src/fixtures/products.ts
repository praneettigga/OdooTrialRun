// Placeholder listings for Stage 2, shaped to the fields the Round 1 wireframe
// documents for a listing (title, category, description, price, condition,
// seller, image placeholder). Real columns land in docs/SCHEMA.md — when a
// service exists, pages swap this import for a services/ call.

export const CATEGORIES = [
  'Furniture',
  'Electronics',
  'Books',
  'Clothing',
  'Sports',
  'Kitchen',
] as const

export type Category = (typeof CATEGORIES)[number]

export type Condition = 'Like new' | 'Good' | 'Well used'

export type Product = {
  id: string
  title: string
  description: string
  category: Category
  price: number
  condition: Condition
  seller: string
  listedDaysAgo: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'teak-writing-desk',
    title: 'Teak writing desk with drawer',
    description:
      'Solid teak, two coats of fresh oil. One drawer runs a little stiff in monsoon but closes flush.',
    category: 'Furniture',
    price: 6400,
    condition: 'Good',
    seller: 'Nandita R.',
    listedDaysAgo: 2,
  },
  {
    id: 'sony-mdr-headphones',
    title: 'Sony MDR-7506 studio headphones',
    description:
      'Bought for a home studio I no longer run. Earpads replaced last year, coiled cable intact.',
    category: 'Electronics',
    price: 4800,
    condition: 'Like new',
    seller: 'Imran S.',
    listedDaysAgo: 1,
  },
  {
    id: 'cast-iron-kadai',
    title: 'Pre-seasoned cast iron kadai, 10 inch',
    description:
      'Seasoned over about two years of daily use, so it is properly non-stick now. Heavy — it is cast iron.',
    category: 'Kitchen',
    price: 1250,
    condition: 'Good',
    seller: 'Lakshmi V.',
    listedDaysAgo: 5,
  },
  {
    id: 'hercules-roadeo-cycle',
    title: 'Hercules Roadeo A200 city bike',
    description:
      'Serviced in June: new brake pads, new chain. Frame has scratches on the left side from a fall.',
    category: 'Sports',
    price: 7200,
    condition: 'Good',
    seller: 'Arjun M.',
    listedDaysAgo: 8,
  },
  {
    id: 'penguin-classics-set',
    title: 'Penguin Classics — 12 book set',
    description:
      'Mixed Russian and French titles. Spines are creased from reading, no markings or highlighting inside.',
    category: 'Books',
    price: 2100,
    condition: 'Well used',
    seller: 'Priya D.',
    listedDaysAgo: 12,
  },
  {
    id: 'linen-kurta-set',
    title: 'Handloom linen kurta, size M',
    description:
      'Worn maybe four times. Natural undyed linen, softens further with washing. Slight fade at the collar.',
    category: 'Clothing',
    price: 900,
    condition: 'Like new',
    seller: 'Zoya K.',
    listedDaysAgo: 3,
  },
  {
    id: 'rattan-lounge-chair',
    title: 'Rattan lounge chair with cushion',
    description:
      'Cane weave is fully intact. Cushion cover is washable cotton and comes with the chair.',
    category: 'Furniture',
    price: 5300,
    condition: 'Good',
    seller: 'Nandita R.',
    listedDaysAgo: 6,
  },
  {
    id: 'kindle-paperwhite-10',
    title: 'Kindle Paperwhite, 10th gen, 8GB',
    description:
      'Battery still holds about three weeks. Small scuff on the bezel, screen is unmarked. Charger included.',
    category: 'Electronics',
    price: 5600,
    condition: 'Good',
    seller: 'Rahul B.',
    listedDaysAgo: 4,
  },
  {
    id: 'yoga-mat-cork',
    title: 'Cork yoga mat, 4mm',
    description:
      'Cork top over natural rubber base. Grippy when damp, which is the point. Cleaned before listing.',
    category: 'Sports',
    price: 1600,
    condition: 'Good',
    seller: 'Meera T.',
    listedDaysAgo: 9,
  },
  {
    id: 'copper-water-jug',
    title: 'Hammered copper jug, 1.5 litre',
    description:
      'Traditional hammered finish. Needs the usual lemon-and-salt polish every few weeks to stay bright.',
    category: 'Kitchen',
    price: 1400,
    condition: 'Like new',
    seller: 'Lakshmi V.',
    listedDaysAgo: 7,
  },
  {
    id: 'architecture-monographs',
    title: 'Architecture monographs — Correa, Doshi',
    description:
      'Two hardbacks on Indian modernism. Dust jackets are worn at the corners, pages are clean.',
    category: 'Books',
    price: 3200,
    condition: 'Good',
    seller: 'Priya D.',
    listedDaysAgo: 14,
  },
  {
    id: 'denim-jacket-selvedge',
    title: 'Selvedge denim jacket, size L',
    description:
      'Three years of wear, so the fades are real and set in. No tears. Buttons all present.',
    category: 'Clothing',
    price: 2800,
    condition: 'Well used',
    seller: 'Imran S.',
    listedDaysAgo: 10,
  },
]
