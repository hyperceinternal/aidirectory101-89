
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ExternalLink, Tag } from 'lucide-react';
import { AIProduct, aiProducts } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const AIToolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<AIProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<AIProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Find the product with the matching id
    const foundProduct = aiProducts.find(p => p.id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Find related products (same category or shared tags)
      const related = aiProducts
        .filter(p => p.id !== id && 
          (p.category === foundProduct.category || 
           p.tags.some(tag => foundProduct.tags.includes(tag)))
        )
        .slice(0, 3); // Limit to 3 related products
      
      setRelatedProducts(related);
    }
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearch={(term) => navigate(`/search?q=${term}`)} />
        <main className="flex-grow pt-24 px-4 container mx-auto">
          <div className="animate-pulse bg-gray-100 h-96 rounded-lg mb-8"></div>
          <div className="animate-pulse bg-gray-100 h-20 rounded-lg mb-4"></div>
          <div className="animate-pulse bg-gray-100 h-40 rounded-lg"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearch={(term) => navigate(`/search?q=${term}`)} />
        <main className="flex-grow pt-24 px-4 container mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The AI tool you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Homepage
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={(term) => navigate(`/search?q=${term}`)} />
      
      <main className="flex-grow pt-24 px-4 container mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-ai-purple hover:text-ai-dark transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="h-60 bg-gradient-to-r from-ai-dark to-ai-purple flex items-center justify-center p-8">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-full w-auto object-contain"
                />
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-ai-dark">{product.name}</h1>
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="mb-6 text-gray-700 text-lg leading-relaxed">
                  {product.description}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Category</h3>
                  <Badge className="bg-ai-purple text-white">{product.category}</Badge>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Pricing</h3>
                  <p className="text-gray-700">{product.pricingModel}</p>
                </div>
                
                <a 
                  href={product.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-ai-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-ai-purple/90 transition-colors"
                >
                  Visit Website <ExternalLink className="inline h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-ai-dark">Related Tools</h2>
              <div className="space-y-4">
                {relatedProducts.length > 0 ? (
                  relatedProducts.map(related => (
                    <Link key={related.id} to={`/tool/${related.id}`} className="block">
                      <Card className="overflow-hidden transition-all hover:shadow-md p-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                            <img src={related.image} alt={related.name} className="max-w-full max-h-full p-2" />
                          </div>
                          <div>
                            <h3 className="font-medium text-ai-dark">{related.name}</h3>
                            <p className="text-sm text-gray-500">{related.category}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500">No related tools found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIToolDetails;
