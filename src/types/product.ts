
import { z } from 'zod';

export interface AIProduct {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  url: string;
  image: string;
  logoUrl?: string;
  tags: string[];
  rating: number;
  featured: boolean;
  pricingModel: string;
  reviewCount?: number;
  foundedYear?: number;
  userCount?: number;
  slug?: string;
  useCases?: UseCase[];
  imageFile?: File;
  logoFile?: File;
}

export interface UseCase {
  title: string;
  description: string;
}

export interface ToolSubmission {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  category: string;
  url: string;
  image_url?: string;
  pricing_model: string;
  tags?: string[];
  email?: string;
  status: string;
  submitted_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  submitted_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const ToolSchema = z.object({
  name: z.string().min(2, "Tool name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  url: z.string().url("Must be a valid URL"),
  image: z.string().url("Must be a valid image URL"),
  logoUrl: z.string().url("Must be a valid logo URL").optional(),
  tags: z.array(z.string()),
  rating: z.number().min(0).max(5),
  featured: z.boolean(),
  pricingModel: z.string(),
  reviewCount: z.number().optional(),
  foundedYear: z.number().optional(),
  userCount: z.number().optional(),
  slug: z.string().optional(),
  useCases: z.array(
    z.object({
      title: z.string(),
      description: z.string()
    })
  ).optional()
});
