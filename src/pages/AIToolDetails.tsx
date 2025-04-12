
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Calendar, 
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductHeader from '@/components/ProductHeader';
import ProductSidebar from '@/components/ProductSidebar';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aiProducts } from '@/data/products';
import type { AIProduct } from '@/types/product';
import ProductInfoCard from '@/components/ProductInfoCard';
import Footer from '@/components/Footer';

// Define mock data for the sections that aren't in our AIProduct type
interface UseCase {
  title: string;
  description: string;
}

const AIToolDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [product, setProduct] = useState<AIProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Mock data for sections not in our AIProduct type
  const [useCases, setUseCases] = useState<UseCase[]>([]);

  useEffect(() => {
    const fetchProductDetails = () => {
      setIsLoading(true);
      
      // Find product by ID
      const foundProduct = aiProducts.find(p => p.id === id);
      
      // Simulate network delay
      setTimeout(() => {
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Set mock data
          setUseCases([
            { title: "Content creation for blogs and social media", description: "Generate high-quality content quickly" },
            { title: "Academic research and paper writing", description: "Help with research and summarization" },
            { title: "Email drafting and communication", description: "Automate responses to common questions" },
            { title: "Creative writing and storytelling", description: "Get inspiration and content ideas" },
            { title: "Business documentation and reports", description: "Extract insights from large datasets" },
          ]);
          
          // Check if favorite
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          setIsFavorite(favorites.includes(foundProduct.id));
        }
        setIsLoading(false);
      }, 800);
    };
    
    fetchProductDetails();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link copied",
          description: "URL has been copied to clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Please try again or copy the URL manually.",
          variant: "destructive",
        });
      });
  };

  const toggleFavorite = () => {
    if (!product) return;
    
    // Get existing favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const newFavorites = favorites.filter((favId: string) => favId !== product.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({
        title: "Removed from collection",
        description: `${product.name} has been removed from your collection.`,
      });
    } else {
      // Add to favorites
      favorites.push(product.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast({
        title: "Added to collection",
        description: `${product.name} has been added to your collection.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The AI tool you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Return to Homepage</Link>
        </Button>
      </div>
    );
  }

  const foundedYear = 2021;
  const currentYear = new Date().getFullYear();
  const yearsInIndustry = currentYear - foundedYear;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ProductHeader />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/10 to-white pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-6">
              <img
                src={product.image}
                alt={`${product.name} logo`}
                className="w-20 h-20 rounded-xl object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">{product.description}</p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="ml-2 font-medium">
                  {product.rating.toFixed(1)}/5 ({product.reviewCount || 0} reviews)
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-5 w-5 text-gray-500" />
                <span>10,000+ users</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>Founded {foundedYear}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button size="lg" asChild>
                <a href={product.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Try {product.name} <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
            ></path>
          </svg>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About {product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                {useCases.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Key Use Cases</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-1 bg-primary/10 rounded-full p-1">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                          <span>{useCase.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Added more spacing between About section and InfoCards */}
            <div className="mt-12">
              <ProductInfoCard 
                rating={product.rating} 
                reviewCount={product.reviewCount || 0} 
                foundedYear={foundedYear} 
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <ProductSidebar 
              websiteUrl={product.url}
              categories={product.tags}
              onShare={handleShare}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default AIToolDetails;
