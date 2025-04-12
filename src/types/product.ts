
export interface AIProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  image: string;
  tags: string[];
  rating: number;
  featured?: boolean;
  pricingModel: string;
  reviewCount?: number; // Changed from reviews to reviewCount
}
