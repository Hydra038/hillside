// Mock data for local development when database connection fails
export const mockProducts = [
  {
    id: 1,
    name: 'Premium Oak Firewood',
    description: 'High-quality seasoned oak firewood, perfect for long-burning fires with excellent heat output.',
    price: 89.99,
    category: 'hardwood',
    image_url: '/images/oak-firewood.jpg',
    stock_quantity: 50,
    season: 'all-season',
    features: {
      burnTime: '4-6 hours',
      heatOutput: 'High',
      moistureContent: '15-20%',
      seasoned: true,
      weight: '40 lbs per bundle'
    },
    is_featured: true
  },
  {
    id: 2,
    name: 'Mixed Hardwood Bundle',
    description: 'A perfect mix of oak, maple, and birch for versatile burning needs.',
    price: 69.99,
    category: 'hardwood',
    image_url: '/images/mixed-hardwood.jpg',
    stock_quantity: 75,
    season: 'all-season',
    features: {
      burnTime: '3-5 hours',
      heatOutput: 'Medium-High',
      moistureContent: '18-22%',
      variety: 'Oak, Maple, Birch',
      weight: '35 lbs per bundle'
    },
    is_featured: true
  },
  {
    id: 3,
    name: 'Pine Kindling Pack',
    description: 'Easy-to-light pine kindling, perfect for starting fires quickly.',
    price: 24.99,
    category: 'softwood',
    image_url: '/images/pine-kindling.jpg',
    stock_quantity: 100,
    season: 'all-season',
    features: {
      burnTime: '30-60 minutes',
      heatOutput: 'Medium',
      purpose: 'Fire starting',
      pieces: '50+ pieces',
      weight: '15 lbs per bundle'
    },
    is_featured: false
  }
];

export const getProducts = async () => {
  // Try database first, fallback to mock data
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const products = await prisma.product.findMany();
    await prisma.$disconnect();
    return products;
  } catch (error) {
    console.warn('Database connection failed, using mock data for development');
    return mockProducts;
  }
};
