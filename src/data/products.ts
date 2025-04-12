
export interface AIProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  url: string;
  rating: number;
  pricingModel: string;
  featured: boolean;
}

// Sample data for our AI products directory
export const aiProducts: AIProduct[] = [
  {
    id: "1",
    name: "ChatGPT",
    description: "Advanced language model that can generate human-like text, answer questions, and assist with various tasks.",
    category: "Language Model",
    tags: ["Chatbot", "Text Generation", "Question Answering"],
    image: "/placeholder.svg",
    url: "https://chat.openai.com",
    rating: 4.8,
    pricingModel: "Freemium",
    featured: true
  },
  {
    id: "2",
    name: "DALL-E",
    description: "AI system that creates realistic images and art from natural language descriptions.",
    category: "Image Generation",
    tags: ["Art", "Design", "Creation"],
    image: "/placeholder.svg",
    url: "https://openai.com/dall-e-2",
    rating: 4.7,
    pricingModel: "Pay-per-use",
    featured: true
  },
  {
    id: "3",
    name: "Midjourney",
    description: "AI art generator that creates images from textual descriptions using machine learning techniques.",
    category: "Image Generation",
    tags: ["Art", "Design", "Creation"],
    image: "/placeholder.svg",
    url: "https://www.midjourney.com",
    rating: 4.6,
    pricingModel: "Subscription",
    featured: true
  },
  {
    id: "4",
    name: "Anthropic Claude",
    description: "Language model designed to be helpful, harmless, and honest, with a focus on reducing harmful outputs.",
    category: "Language Model",
    tags: ["Chatbot", "Assistant"],
    image: "/placeholder.svg",
    url: "https://www.anthropic.com/claude",
    rating: 4.5,
    pricingModel: "Freemium",
    featured: false
  },
  {
    id: "5",
    name: "Jasper",
    description: "AI writing assistant that helps create content for blogs, social media, and marketing materials.",
    category: "Content Creation",
    tags: ["Writing", "Marketing"],
    image: "/placeholder.svg",
    url: "https://www.jasper.ai",
    rating: 4.3,
    pricingModel: "Subscription",
    featured: false
  },
  {
    id: "6",
    name: "Hugging Face",
    description: "Platform that offers a wide range of pre-trained models for various AI applications.",
    category: "AI Platform",
    tags: ["Models", "Development", "Tools"],
    image: "/placeholder.svg",
    url: "https://huggingface.co",
    rating: 4.7,
    pricingModel: "Freemium",
    featured: true
  },
  {
    id: "7",
    name: "GitHub Copilot",
    description: "AI pair programmer that offers code suggestions based on comments and context.",
    category: "Developer Tool",
    tags: ["Coding", "Assistance", "Productivity"],
    image: "/placeholder.svg",
    url: "https://github.com/features/copilot",
    rating: 4.6,
    pricingModel: "Subscription",
    featured: false
  },
  {
    id: "8",
    name: "Grammarly",
    description: "AI-powered writing assistant that checks grammar, spelling, and style in real-time.",
    category: "Writing Assistant",
    tags: ["Grammar", "Writing", "Editing"],
    image: "/placeholder.svg",
    url: "https://www.grammarly.com",
    rating: 4.4,
    pricingModel: "Freemium",
    featured: false
  },
  {
    id: "9",
    name: "Stable Diffusion",
    description: "Open-source image generation model that creates detailed images based on text descriptions.",
    category: "Image Generation",
    tags: ["Art", "Creation", "Open Source"],
    image: "/placeholder.svg",
    url: "https://stability.ai",
    rating: 4.5,
    pricingModel: "Open Source",
    featured: true
  },
  {
    id: "10",
    name: "Replika",
    description: "AI companion that can have personalized conversations and provide emotional support.",
    category: "Personal Assistant",
    tags: ["Companion", "Emotional Support", "Chatbot"],
    image: "/placeholder.svg",
    url: "https://replika.ai",
    rating: 4.0,
    pricingModel: "Freemium",
    featured: false
  },
  {
    id: "11",
    name: "Adept",
    description: "AI assistant that can perform complex tasks across your computer applications.",
    category: "Automation",
    tags: ["Task Execution", "Workflow", "Productivity"],
    image: "/placeholder.svg",
    url: "https://www.adept.ai",
    rating: 4.2,
    pricingModel: "Contact for Pricing",
    featured: false
  },
  {
    id: "12",
    name: "Runway",
    description: "Creative suite powered by AI offering tools for video editing, image generation, and more.",
    category: "Creative Tools",
    tags: ["Video", "Editing", "Design"],
    image: "/placeholder.svg",
    url: "https://runwayml.com",
    rating: 4.4,
    pricingModel: "Subscription",
    featured: true
  }
];

// Get all unique categories from products
export const getCategories = (): string[] => {
  const categoriesSet = new Set<string>();
  aiProducts.forEach(product => categoriesSet.add(product.category));
  return Array.from(categoriesSet);
};

// Get all unique tags from products
export const getTags = (): string[] => {
  const tagsSet = new Set<string>();
  aiProducts.forEach(product => {
    product.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet);
};

// Get featured products
export const getFeaturedProducts = (): AIProduct[] => {
  return aiProducts.filter(product => product.featured);
};

// Filter products by category and/or search term
export const filterProducts = (category: string = "", searchTerm: string = ""): AIProduct[] => {
  return aiProducts.filter(product => {
    const matchesCategory = category ? product.category === category : true;
    const matchesSearch = searchTerm 
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    return matchesCategory && matchesSearch;
  });
};
