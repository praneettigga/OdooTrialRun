// Marketplace catalogue. Separate from fixtures/products.ts on purpose: that
// file is the landing page's dataset and the landing lane is editing it, so
// growing it there would change their grid and their item count.
//
// Shaped to docs/SCHEMA.md `products`: id, seller_id, title, description,
// category, price, image_url, status, condition. `listedDaysAgo` stands in for
// created_at until the real column exists.

export const CATEGORIES = [
  'Furniture',
  'Electronics',
  'Books',
  'Clothing',
  'Sports',
  'Kitchen',
] as const

export const CONDITIONS = ['Like new', 'Good', 'Well used'] as const

export const STATUSES = ['available', 'sold', 'draft'] as const

export type Category = (typeof CATEGORIES)[number]
export type Condition = (typeof CONDITIONS)[number]
export type ListingStatus = (typeof STATUSES)[number]

export type Listing = {
  id: string
  sellerId: string
  sellerName: string
  title: string
  description: string
  category: Category
  price: number
  imageUrl: string | null
  status: ListingStatus
  condition: Condition
  listedDaysAgo: number
}

export const CURRENT_USER_ID = 'u-armaan'

export const LISTINGS: Listing[] = [
  {
    id: 'teak-writing-desk',
    sellerId: 'u-nandita',
    sellerName: 'Nandita R.',
    title: 'Teak writing desk with drawer',
    description:
      'Solid teak, two coats of fresh oil. One drawer runs a little stiff in monsoon but closes flush. Collection from Indiranagar.',
    category: 'Furniture',
    price: 6400,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 2,
  },
  {
    id: 'sony-mdr-headphones',
    sellerId: 'u-imran',
    sellerName: 'Imran S.',
    title: 'Sony MDR-7506 studio headphones',
    description:
      'Bought for a home studio I no longer run. Earpads replaced last year, coiled cable intact. Comes with the drawstring pouch.',
    category: 'Electronics',
    price: 4800,
    imageUrl: null,
    status: 'available',
    condition: 'Like new',
    listedDaysAgo: 1,
  },
  {
    id: 'cast-iron-kadai',
    sellerId: 'u-lakshmi',
    sellerName: 'Lakshmi V.',
    title: 'Pre-seasoned cast iron kadai, 10 inch',
    description:
      'Seasoned over about two years of daily use, so it is properly non-stick now. Heavy — it is cast iron.',
    category: 'Kitchen',
    price: 1250,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 5,
  },
  {
    id: 'hercules-roadeo-cycle',
    sellerId: 'u-arjun',
    sellerName: 'Arjun M.',
    title: 'Hercules Roadeo A200 city bike',
    description:
      'Serviced in June: new brake pads, new chain. Frame has scratches on the left side from a fall. Rides straight.',
    category: 'Sports',
    price: 7200,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 8,
  },
  {
    id: 'penguin-classics-set',
    sellerId: 'u-priya',
    sellerName: 'Priya D.',
    title: 'Penguin Classics — 12 book set',
    description:
      'Mixed Russian and French titles. Spines are creased from reading, no markings or highlighting inside.',
    category: 'Books',
    price: 2100,
    imageUrl: null,
    status: 'available',
    condition: 'Well used',
    listedDaysAgo: 12,
  },
  {
    id: 'linen-kurta-set',
    sellerId: 'u-zoya',
    sellerName: 'Zoya K.',
    title: 'Handloom linen kurta, size M',
    description:
      'Worn maybe four times. Natural undyed linen, softens further with washing. Slight fade at the collar.',
    category: 'Clothing',
    price: 900,
    imageUrl: null,
    status: 'available',
    condition: 'Like new',
    listedDaysAgo: 3,
  },
  {
    id: 'rattan-lounge-chair',
    sellerId: 'u-nandita',
    sellerName: 'Nandita R.',
    title: 'Rattan lounge chair with cushion',
    description:
      'Cane weave is fully intact. Cushion cover is washable cotton and comes with the chair.',
    category: 'Furniture',
    price: 5300,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 6,
  },
  {
    id: 'kindle-paperwhite-10',
    sellerId: 'u-rahul',
    sellerName: 'Rahul B.',
    title: 'Kindle Paperwhite, 10th gen, 8GB',
    description:
      'Battery still holds about three weeks. Small scuff on the bezel, screen is unmarked. Charger included.',
    category: 'Electronics',
    price: 5600,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 4,
  },
  {
    id: 'yoga-mat-cork',
    sellerId: 'u-meera',
    sellerName: 'Meera T.',
    title: 'Cork yoga mat, 4mm',
    description:
      'Cork top over natural rubber base. Grippy when damp, which is the point. Cleaned before listing.',
    category: 'Sports',
    price: 1600,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 9,
  },
  {
    id: 'copper-water-jug',
    sellerId: 'u-lakshmi',
    sellerName: 'Lakshmi V.',
    title: 'Hammered copper jug, 1.5 litre',
    description:
      'Traditional hammered finish. Needs the usual lemon-and-salt polish every few weeks to stay bright.',
    category: 'Kitchen',
    price: 1400,
    imageUrl: null,
    status: 'available',
    condition: 'Like new',
    listedDaysAgo: 7,
  },
  {
    id: 'architecture-monographs',
    sellerId: 'u-priya',
    sellerName: 'Priya D.',
    title: 'Architecture monographs — Correa, Doshi',
    description:
      'Two hardbacks on Indian modernism. Dust jackets are worn at the corners, pages are clean.',
    category: 'Books',
    price: 3200,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 14,
  },
  {
    id: 'denim-jacket-selvedge',
    sellerId: 'u-imran',
    sellerName: 'Imran S.',
    title: 'Selvedge denim jacket, size L',
    description:
      'Three years of wear, so the fades are real and set in. No tears. All buttons present.',
    category: 'Clothing',
    price: 2800,
    imageUrl: null,
    status: 'available',
    condition: 'Well used',
    listedDaysAgo: 10,
  },
  {
    id: 'mango-wood-bookshelf',
    sellerId: 'u-nandita',
    sellerName: 'Nandita R.',
    title: 'Mango wood bookshelf, five shelves',
    description:
      'Holds a serious amount of books without bowing. One shelf has a water ring on the underside where a plant sat.',
    category: 'Furniture',
    price: 4900,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 16,
  },
  {
    id: 'canon-eos-1500d',
    sellerId: CURRENT_USER_ID,
    sellerName: 'Armaan M.',
    title: 'Canon EOS 1500D with 18-55mm kit lens',
    description:
      'Shutter count is around 9,000. Sensor cleaned professionally in March. Includes battery, charger and a 32GB card.',
    category: 'Electronics',
    price: 18500,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 3,
  },
  {
    id: 'yonex-badminton-pair',
    sellerId: CURRENT_USER_ID,
    sellerName: 'Armaan M.',
    title: 'Yonex badminton racquets, pair',
    description:
      'Both restrung in April. Grips replaced at the same time. One has a small paint chip on the frame.',
    category: 'Sports',
    price: 3400,
    imageUrl: null,
    status: 'sold',
    condition: 'Good',
    listedDaysAgo: 21,
  },
  {
    id: 'prestige-pressure-cooker',
    sellerId: 'u-lakshmi',
    sellerName: 'Lakshmi V.',
    title: 'Prestige pressure cooker, 5 litre',
    description:
      'Stainless steel, gasket and safety valve both replaced this year. Whistle included.',
    category: 'Kitchen',
    price: 1850,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 11,
  },
  {
    id: 'wool-overcoat',
    sellerId: 'u-rahul',
    sellerName: 'Rahul B.',
    title: 'Wool overcoat, size L',
    description:
      'Bought for one Delhi winter and barely used since. Fully lined. Dry cleaned before listing.',
    category: 'Clothing',
    price: 3900,
    imageUrl: null,
    status: 'available',
    condition: 'Like new',
    listedDaysAgo: 18,
  },
  {
    id: 'architect-desk-lamp',
    sellerId: CURRENT_USER_ID,
    sellerName: 'Armaan M.',
    title: 'Architect desk lamp, adjustable arm',
    description:
      'Counterweighted arm holds position properly. Takes a standard E27 bulb, one included. Cable is 1.8m.',
    category: 'Furniture',
    price: 2200,
    imageUrl: null,
    status: 'available',
    condition: 'Like new',
    listedDaysAgo: 5,
  },
  {
    id: 'programming-books-bundle',
    sellerId: 'u-meera',
    sellerName: 'Meera T.',
    title: 'Programming books — five title bundle',
    description:
      'Clean Code, The Pragmatic Programmer, SICP, Designing Data-Intensive Applications and Refactoring. Some pencil notes in SICP.',
    category: 'Books',
    price: 4200,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 13,
  },
  {
    id: 'jbl-flip-4',
    sellerId: 'u-priya',
    sellerName: 'Priya D.',
    title: 'JBL Flip 4 bluetooth speaker',
    description:
      'Still gets roughly ten hours a charge. Fabric has a mark on one side. Charging cable included.',
    category: 'Electronics',
    price: 2600,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 20,
  },
  {
    id: 'asics-running-shoes',
    sellerId: 'u-zoya',
    sellerName: 'Zoya K.',
    title: 'Asics Gel-Nimbus running shoes, UK 9',
    description:
      'Around 200km on them, so plenty of midsole left. Outsole wear is even. Washed and aired.',
    category: 'Sports',
    price: 2900,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 15,
  },
  {
    id: 'ceramic-dinner-set',
    sellerId: CURRENT_USER_ID,
    sellerName: 'Armaan M.',
    title: 'Ceramic dinner set, 12 piece',
    description:
      'Four each of dinner plates, side plates and bowls. Two side plates have minor glaze crazing, no chips.',
    category: 'Kitchen',
    price: 2400,
    imageUrl: null,
    status: 'available',
    condition: 'Good',
    listedDaysAgo: 9,
  },
  {
    id: 'mesh-office-chair',
    sellerId: 'u-arjun',
    sellerName: 'Arjun M.',
    title: 'Mesh-back office chair, adjustable',
    description:
      'Height and tilt both work. Armrests are fixed, not adjustable. Castors roll fine on hard floors.',
    category: 'Furniture',
    price: 5100,
    imageUrl: null,
    status: 'available',
    condition: 'Well used',
    listedDaysAgo: 24,
  },
  {
    id: 'handwoven-cotton-saree',
    sellerId: CURRENT_USER_ID,
    sellerName: 'Armaan M.',
    title: 'Handwoven cotton saree, indigo',
    description:
      'Natural indigo dye, so it will soften and lighten with washing. Blouse piece is unstitched and included.',
    category: 'Clothing',
    price: 3100,
    imageUrl: null,
    status: 'draft',
    condition: 'Like new',
    listedDaysAgo: 1,
  },
]
