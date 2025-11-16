export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  category?: string;
  stockQuantity?: number;
  isFeatured?: boolean;
  createdAt: Date;
  // removed updatedAt, weight, dimensions, moisture, season, features
}
