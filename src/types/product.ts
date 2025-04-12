
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
  reviews?: number; // Added for review count
}
