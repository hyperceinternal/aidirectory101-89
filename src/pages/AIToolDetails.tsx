
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ExternalLink, Tag, Globe, Users, Zap, Calendar, Check, CircleX } from 'lucide-react';
import { AIProduct, aiProducts } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      
      <main className="flex-grow pt-20 px-4 container mx-auto">
        {/* Breadcrumb & Back Button */}
        <div className="mb-6 flex items-center">
          <Link to="/" className="inline-flex items-center text-ai-purple hover:text-ai-dark transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-500">Home</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700">{product.name}</span>
        </div>
        
        {/* Product Header Section */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="w-24 h-24 bg-white rounded-lg shadow-sm p-2 flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-full w-auto object-contain"
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-ai-dark mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-4 min-w-[150px]">
            <div className="text-4xl font-bold text-ai-purple mb-1">{product.rating.toFixed(1)}</div>
            <div className="flex items-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.round(product.rating) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">User Rating</p>
            <p className="text-xs text-gray-500">Based on {10} reviews</p>
          </div>
          
          <div>
            <a 
              href={product.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Visit Website <ExternalLink className="inline h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
        
        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Platforms</h3>
                <p className="font-semibold">{product.category}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-600">User Types</h3>
                <p className="font-semibold">{product.tags.length} Types</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <Zap className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Features</h3>
                <p className="font-semibold">{product.tags.length}+ Features</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <Calendar className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Last Updated</h3>
                <p className="font-semibold">April 2025</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="border-b w-full justify-start rounded-none bg-transparent mb-4 pb-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-ai-purple rounded-none bg-transparent"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-ai-purple rounded-none bg-transparent"
            >
              Integrations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-bold text-ai-dark mb-4">{product.name} Review</h2>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Features, Pros, Cons & User Reviews</h3>
                  <p className="text-gray-700 mb-6">{product.name} is an {product.category} that {product.description}</p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">What is {product.name}?</h3>
                  <p className="text-gray-700 mb-6">
                    {product.name} is a powerful {product.category.toLowerCase()} tool designed to help users 
                    {product.description.toLowerCase()}. It offers a range of features including {product.tags.join(', ')}.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Who is {product.name} best for?</h3>
                  <p className="text-gray-700">
                    This tool is ideal for users interested in {product.category} who need solutions for 
                    {product.tags.map(tag => ` ${tag.toLowerCase()}`).join(',')}. Whether you're a beginner or 
                    an expert, {product.name} offers features that can enhance your workflow.
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-bold text-ai-dark mb-4 uppercase">{product.name} Features</h2>
                  <ul className="space-y-4">
                    {product.tags.map((tag, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{tag} functionality</h4>
                          <p className="text-sm text-green-600">{tag}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-ai-dark mb-4 uppercase">Limitations</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-red-100 p-1 rounded-full mr-3 mt-1">
                        <CircleX className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Limited free tier</h4>
                        <p className="text-sm text-red-600">Pricing</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-100 p-1 rounded-full mr-3 mt-1">
                        <CircleX className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Learning curve for beginners</h4>
                        <p className="text-sm text-red-600">User Experience</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-ai-dark mb-4">Integrations</h2>
              <p className="text-gray-600">No integration information available for this product.</p>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Related Products Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-ai-dark mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-sm text-gray-500">{related.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-3">No related tools found</p>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIToolDetails;
