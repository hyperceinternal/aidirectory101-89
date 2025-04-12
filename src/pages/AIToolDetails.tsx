
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductHeader from '@/components/ProductHeader';
import ProductHero from '@/components/ProductHero';
import ProductInfoCard from '@/components/ProductInfoCard';
import ProductSidebar from '@/components/ProductSidebar';
import Footer from '@/components/Footer';
import { fetchToolById } from '@/services/aiToolsService';
import { AIProduct } from '@/types/product';

const AIToolDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { 
    data: product, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['aiTool', id],
    queryFn: () => fetchToolById(id || ''),
    enabled: !!id
  });

  // Check if favorite
  useEffect(() => {
    if (product) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(product.id));
    }
  }, [product]);

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

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The AI tool you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="text-primary underline">Return to Homepage</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ProductHeader />
      
      {/* Hero Section */}
      <ProductHero product={product} />
      
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
                {product.useCases && product.useCases.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Key Use Cases</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.useCases.map((useCase, index) => (
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

            {/* Add proper spacing between About section and InfoCard */}
            <div className="mt-12">
              <ProductInfoCard 
                rating={product.rating} 
                reviewCount={product.reviewCount || 0} 
                foundedYear={product.foundedYear || 2021} 
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
