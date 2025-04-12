
import React, { useState } from 'react';
import { Star, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AIProduct } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FeaturedProductsProps {
  products: AIProduct[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (products.length === 0) return null;
  
  // Ensure we have the active product
  const activeTool = products[activeIndex];
  
  // Get the appropriate color class based on product category
  const getColorClass = (category: string) => {
    switch(category) {
      case 'Language Model':
        return 'from-purple-500 to-indigo-600';
      case 'Image Generation':
        return 'from-teal-500 to-emerald-600';
      case 'Developer Tool':
        return 'from-blue-500 to-cyan-600';
      case 'AI Platform':
        return 'from-pink-500 to-rose-600';
      case 'Content Creation':
        return 'from-orange-500 to-amber-600';
      default:
        return 'from-ai-purple to-ai-dark';
    }
  };

  // Get highlight text for each product
  const getHighlight = (index: number, product: AIProduct) => {
    if (index === 0) return "Most Popular";
    if (product.rating >= 4.8) return "Top Rated";
    if (product.category === "Image Generation") return "Best for Creatives";
    if (product.category === "Developer Tool") return "Developer Favorite";
    return "Featured";
  };
  
  return (
    <section className="mb-16 animate-fade-in">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <h2 className="text-sm font-medium text-yellow-500 uppercase tracking-wider">Featured</h2>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Top AI Solutions</h1>
          </div>
          <Link to="/categories" className="flex items-center gap-1 text-sm font-medium mt-4 md:mt-0 hover:underline">
            View all AI tools
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Featured tool navigation */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0">
            {products.map((product, index) => (
              <button
                key={product.id}
                onClick={() => setActiveIndex(index)}
                className={`relative flex-shrink-0 w-full p-4 rounded-xl transition-all duration-200 ${
                  activeIndex === index
                    ? "bg-white shadow-lg border-2 border-primary/20"
                    : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center border border-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs ml-1">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                {activeIndex === index && (
                  <div
                    className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary rounded-l-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Featured tool showcase */}
          <div className="lg:col-span-9">
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className={`bg-gradient-to-r ${getColorClass(activeTool.category)} p-0`}>
                <div className="flex flex-col md:flex-row">
                  {/* Tool image */}
                  <div className="md:w-1/2 relative">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={activeTool.image}
                        alt={`${activeTool.name} screenshot`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium border border-white/20 shadow-lg">
                      {getHighlight(activeIndex, activeTool)}
                    </div>
                    <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl bg-white p-2 shadow-lg border border-gray-100">
                      <div className="w-full h-full relative">
                        <img
                          src={activeTool.image}
                          alt={activeTool.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tool info */}
                  <div className="md:w-1/2 p-8 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-3xl font-bold">{activeTool.name}</h2>
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <Star className="h-4 w-4 text-yellow-300 fill-yellow-300 mr-1" />
                        <span className="font-medium">{activeTool.rating.toFixed(1)}</span>
                        <span className="text-xs opacity-80 ml-1">({activeTool.id.length * 123})</span>
                      </div>
                    </div>

                    <p className="text-white/90 mb-6 text-lg">{activeTool.description}</p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      <Badge
                        className="bg-white/20 hover:bg-white/30 text-white border-white/10 backdrop-blur-sm"
                      >
                        {activeTool.category}
                      </Badge>
                      {activeTool.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/10 backdrop-blur-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a 
                        href={activeTool.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg border border-white/20 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
                      >
                        Explore Now
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                        Compare
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats bar */}
              <div className="bg-white p-4 grid grid-cols-3 divide-x divide-gray-100">
                <div className="px-4 py-2 text-center">
                  <p className="text-sm text-gray-500">Users</p>
                  <p className="font-bold text-xl">100K+</p>
                </div>
                <div className="px-4 py-2 text-center">
                  <p className="text-sm text-gray-500">Use Cases</p>
                  <p className="font-bold text-xl">50+</p>
                </div>
                <div className="px-4 py-2 text-center">
                  <p className="text-sm text-gray-500">Pricing</p>
                  <p className="font-bold text-xl">{activeTool.pricingModel}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
