export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'hardwood' | 'softwood' | 'kindling';
  imageUrl: string;
  stockQuantity: number;
  weight: number; // in kg
  dimensions: {
    length: number; // in cm
    width: number; // in cm
    height: number; // in cm
  };
  moisture: number; // percentage
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  features: string[];
};
