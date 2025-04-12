
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Share2, Heart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ProductHeader from '@/components/ProductHeader';
import ProductFeaturesList from '@/components/ProductFeaturesList';
import ProductSidebar from '@/components/ProductSidebar';
import ProductInfoCard from '@/components/ProductInfoCard';
import ProductHero from '@/components/ProductHero';
import ProductCTA from '@/components/ProductCTA';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { aiProducts } from '@/data/products';
import type { Product } from '@/types/product';

const AIToolDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProductDetails = () => {
      setIsLoading(true);
      
      // Find product by ID
      const foundProduct = aiProducts.find(p => p.id === id);
      
      // Simulate network delay
      setTimeout(() => {
        if (foundProduct) {
          setProduct(foundProduct);
          // Check if favorite
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          setIsFavorite(favorites.includes(foundProduct.id));
        }
        setIsLoading(false);
      }, 800);
    };
    
    fetchProductDetails();
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

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
        title: "Removed from favorites",
        description: `${product.name} has been removed from your favorites.`,
      });
    } else {
      // Add to favorites
      favorites.push(product.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`,
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

  return (
    <div className="min-h-screen flex flex-col">
      <ProductHeader 
        name={product.name} 
        logo={product.logo} 
        onBack={goBack}
        onShare={handleShare}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />
      
      <main className="flex-grow container mx-auto px-4 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <ProductHero
              name={product.name}
              description={product.description}
              image={product.screenshot}
              categories={product.categories}
              pricing={product.pricing}
              rating={product.rating}
            />
            
            <section>
              <h2 className="text-2xl font-bold mb-4">About {product.name}</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700">{product.longDescription}</p>
              </div>
            </section>
            
            {product.features && product.features.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                <ProductFeaturesList features={product.features} />
              </section>
            )}
            
            <section>
              <h2 className="text-2xl font-bold mb-6">Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.useCases.map((useCase, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
                    <p className="text-gray-600">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Integrations</h2>
              <div className="flex flex-wrap gap-2">
                {product.integrations.map((integration, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {integration}
                  </Badge>
                ))}
              </div>
            </section>
            
            {product.customerReviews && product.customerReviews.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">User Reviews</h2>
                  <Button variant="outline" size="sm">
                    Write a Review
                  </Button>
                </div>
                <div className="space-y-6">
                  {product.customerReviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                            {review.user.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{review.user}</p>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-yellow-400">
                          {Array(5).fill(0).map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2">{review.title}</h3>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
                {product.customerReviews.length > 3 && (
                  <div className="text-center mt-6">
                    <Button variant="outline">View All Reviews</Button>
                  </div>
                )}
              </section>
            )}
            
            <section>
              <h2 className="text-2xl font-bold mb-6">Alternative AI Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.alternatives.map((altId, index) => {
                  const alt = aiProducts.find(p => p.id === altId);
                  if (!alt) return null;
                  
                  return (
                    <Link 
                      key={index} 
                      to={`/tool/${alt.id}`}
                      className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                        <AspectRatio ratio={1}>
                          <img 
                            src={alt.logo || '/placeholder.svg'} 
                            alt={alt.name} 
                            className="object-cover" 
                          />
                        </AspectRatio>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{alt.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{alt.shortDescription}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
          
          <div className="lg:col-span-1 relative">
            <ProductSidebar 
              websiteUrl={product.websiteUrl}
              pricingType={product.pricing}
              pricingDetails={product.pricingDetails}
              platforms={product.platforms}
              lastUpdated={product.lastUpdated}
            />
          </div>
        </div>
      </main>
      
      <ProductCTA />
      <Footer />
    </div>
  );
};

export default AIToolDetails;
