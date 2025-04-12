
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
  reviewCount?: number;
  foundedYear?: number;
  userCount?: number;
  useCases?: UseCase[];
}

export interface UseCase {
  title: string;
  description: string;
}
