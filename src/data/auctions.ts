export type AuctionStatus = 'live' | 'scheduled' | 'ending_soon' | 'ended' | 'sold';
export type Category = 'cars' | 'motorcycles' | 'commercial_vehicles' | 'houses' | 'commercial_buildings' | 'land' | 'other';

export interface Auction {
  id: string;
  title: string;
  category: Category;
  status: AuctionStatus;
  location: string;
  country: string;
  currentBid: number;
  startingBid: number;
  reservePrice: number;
  bidCount: number;
  endTime: Date;
  startTime: Date;
  images: string[];
  currency: 'USD' | 'EUR' | 'GBP';
  description: string;
  // Vehicle fields
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  engine?: string;
  drivetrain?: string;
  vin?: string;
  condition?: string;
  color?: string;
  // Property fields
  propertyType?: string;
  buildingSize?: number;
  landSize?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  yearBuilt?: number;
  floors?: number;
  zoning?: string;
  features?: string[];
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderLabel: string;
  amount: number;
  time: Date;
}

const now = new Date();
const addHours = (h: number) => new Date(now.getTime() + h * 3600000);
const subHours = (h: number) => new Date(now.getTime() - h * 3600000);

export const auctions: Auction[] = [
  {
    id: '1',
    title: '2022 BMW M4 Competition',
    category: 'cars',
    status: 'live',
    location: 'Los Angeles, California',
    country: 'USA',
    currentBid: 48500,
    startingBid: 35000,
    reservePrice: 50000,
    bidCount: 27,
    endTime: addHours(2.25),
    startTime: subHours(48),
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=800&fit=crop&auto=format',
    ],
    currency: 'USD',
    description: 'Exceptional 2022 BMW M4 Competition in Isle of Man Green Metallic. Single owner, full service history, factory options including carbon ceramic brakes and M carbon exterior package.',
    make: 'BMW', model: 'M4 Competition', year: 2022, mileage: 21300,
    fuel: 'Petrol', transmission: 'Automatic', engine: '3.0L Twin-Turbo', drivetrain: 'AWD',
    vin: 'WBS43AY0XN****', condition: 'Used', color: 'Isle of Man Green',
    features: ['Carbon Ceramic Brakes', 'M Carbon Package', 'Harman Kardon Audio', 'Heads-Up Display', 'Adaptive M Suspension'],
  },
  {
    id: '2',
    title: 'Luxury Villa — Côte d\'Azur',
    category: 'houses',
    status: 'live',
    location: 'Nice, Provence-Alpes-Côte d\'Azur',
    country: 'France',
    currentBid: 1850000,
    startingBid: 1500000,
    reservePrice: 2000000,
    bidCount: 14,
    endTime: addHours(5.5),
    startTime: subHours(72),
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop&auto=format',
    ],
    currency: 'EUR',
    description: 'Stunning 5-bedroom villa on the French Riviera with panoramic sea views, private pool, and landscaped gardens. Recently renovated to the highest standards.',
    propertyType: 'Luxury Villa', buildingSize: 620, landSize: 2800, bedrooms: 5, bathrooms: 4,
    parking: 3, yearBuilt: 1985, floors: 3, zoning: 'Residential', condition: 'Excellent',
    features: ['Sea Views', 'Private Pool', 'Landscaped Gardens', 'Wine Cellar', 'Home Automation'],
  },
  {
    id: '3',
    title: '2021 Porsche 911 Turbo S',
    category: 'cars',
    status: 'ending_soon',
    location: 'Miami, Florida',
    country: 'USA',
    currentBid: 185000,
    startingBid: 150000,
    reservePrice: 180000,
    bidCount: 41,
    endTime: addHours(0.75),
    startTime: subHours(96),
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&h=800&fit=crop&auto=format',
    ],
    currency: 'USD',
    description: 'Immaculate 2021 Porsche 911 Turbo S in Guards Red. Less than 8,000 miles, full Porsche service history, equipped with PCCB and Sport Chrono Package.',
    make: 'Porsche', model: '911 Turbo S', year: 2021, mileage: 7800,
    fuel: 'Petrol', transmission: 'PDK', engine: '3.8L Flat-Six', drivetrain: 'AWD',
    vin: 'WP0AD2A95MS****', condition: 'Used', color: 'Guards Red',
  },
  {
    id: '4',
    title: 'Commercial Office Building — Manhattan',
    category: 'commercial_buildings',
    status: 'live',
    location: 'New York, New York',
    country: 'USA',
    currentBid: 4750000,
    startingBid: 4000000,
    reservePrice: 5000000,
    bidCount: 8,
    endTime: addHours(18),
    startTime: subHours(24),
    images: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop&auto=format',
    ],
    currency: 'USD',
    description: '6-story commercial office building in Midtown Manhattan. Fully tenanted with long-term leases. Prime location, recently upgraded systems.',
    propertyType: 'Office Building', buildingSize: 18500, landSize: 4200,
    parking: 45, yearBuilt: 1998, floors: 6, zoning: 'Commercial', condition: 'Good',
  },
  {
    id: '5',
    title: '2020 Ducati Panigale V4 S',
    category: 'motorcycles',
    status: 'scheduled',
    location: 'London, England',
    country: 'UK',
    currentBid: 0,
    startingBid: 18000,
    reservePrice: 22000,
    bidCount: 0,
    endTime: addHours(72),
    startTime: addHours(24),
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&auto=format',
    ],
    currency: 'GBP',
    description: 'Pristine 2020 Ducati Panigale V4 S with Öhlins electronic suspension. Only 2,100 miles. Full service history at authorised dealer.',
    make: 'Ducati', model: 'Panigale V4 S', year: 2020, mileage: 2100,
    fuel: 'Petrol', transmission: 'Manual', engine: '1103cc V4', drivetrain: 'RWD',
    condition: 'Excellent', color: 'Ducati Red',
  },
  {
    id: '6',
    title: 'Coastal Land — Algarve, Portugal',
    category: 'land',
    status: 'live',
    location: 'Faro District, Algarve',
    country: 'Portugal',
    currentBid: 320000,
    startingBid: 250000,
    reservePrice: 350000,
    bidCount: 19,
    endTime: addHours(11),
    startTime: subHours(60),
    images: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=800&fit=crop&auto=format',
    ],
    currency: 'EUR',
    description: 'Exceptional coastal land plot with approved planning permission for a luxury residential development. Unobstructed Atlantic views.',
    propertyType: 'Land', landSize: 12000, zoning: 'Residential Development', condition: 'N/A',
  },
  {
    id: '7',
    title: '2019 Mercedes-Benz Actros 1845',
    category: 'commercial_vehicles',
    status: 'live',
    location: 'Hamburg, Germany',
    country: 'Germany',
    currentBid: 62000,
    startingBid: 50000,
    reservePrice: 68000,
    bidCount: 11,
    endTime: addHours(6),
    startTime: subHours(48),
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&h=800&fit=crop&auto=format',
    ],
    currency: 'EUR',
    description: '2019 Mercedes-Benz Actros 1845 LS in excellent condition. 380,000 km, full maintenance records, Mercedes-Benz certified pre-owned.',
    make: 'Mercedes-Benz', model: 'Actros 1845', year: 2019, mileage: 380000,
    fuel: 'Diesel', transmission: 'Automatic', condition: 'Good',
  },
  {
    id: '8',
    title: 'Historic Townhouse — Amsterdam',
    category: 'houses',
    status: 'ending_soon',
    location: 'Amsterdam, North Holland',
    country: 'Netherlands',
    currentBid: 975000,
    startingBid: 850000,
    reservePrice: 950000,
    bidCount: 23,
    endTime: addHours(1.2),
    startTime: subHours(120),
    images: [
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=800&fit=crop&auto=format',
    ],
    currency: 'EUR',
    description: 'Magnificent 17th-century canal townhouse on one of Amsterdam\'s most prestigious canals. Completely renovated interior, four storeys, private garden.',
    propertyType: 'Townhouse', buildingSize: 310, landSize: 180, bedrooms: 4, bathrooms: 3,
    yearBuilt: 1680, floors: 4, zoning: 'Residential', condition: 'Excellent',
  },
];

export const bids: Bid[] = [
  { id: 'b1', auctionId: '1', bidderId: '2841', bidderLabel: 'Bidder #2841', amount: 48500, time: new Date(now.getTime() - 2 * 60000) },
  { id: 'b2', auctionId: '1', bidderId: '1942', bidderLabel: 'Bidder #1942', amount: 48000, time: new Date(now.getTime() - 5 * 60000) },
  { id: 'b3', auctionId: '1', bidderId: '3371', bidderLabel: 'Bidder #3371', amount: 47500, time: new Date(now.getTime() - 12 * 60000) },
  { id: 'b4', auctionId: '1', bidderId: '2841', bidderLabel: 'Bidder #2841', amount: 47000, time: new Date(now.getTime() - 20 * 60000) },
  { id: 'b5', auctionId: '1', bidderId: '5502', bidderLabel: 'Bidder #5502', amount: 46500, time: new Date(now.getTime() - 35 * 60000) },
];

export const categories = [
  { id: 'cars', label: 'Cars', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop&auto=format', count: 284 },
  { id: 'motorcycles', label: 'Motorcycles', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format', count: 67 },
  { id: 'commercial_vehicles', label: 'Commercial Vehicles', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop&auto=format', count: 43 },
  { id: 'houses', label: 'Houses', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop&auto=format', count: 156 },
  { id: 'commercial_buildings', label: 'Commercial Buildings', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop&auto=format', count: 38 },
  { id: 'land', label: 'Land', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=400&fit=crop&auto=format', count: 92 },
];
