
import React from 'react';
import { Star } from 'lucide-react';
import { AIProduct } from '@/data/products';

interface FeaturedProductsProps {
  products: AIProduct[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  if (products.length === 0) return null;
  
  // Take the first featured product for the hero section
  const heroProduct = products[0];
  
  return (
    <div className="mb-12 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Featured AI Solutions</h2>
      
      <div className="bg-gradient-to-r from-ai-dark to-ai-purple rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 flex items-center justify-center">
            <img 
              src={heroProduct.image} 
              alt={heroProduct.name} 
              className="w-full max-w-md h-auto object-contain"
            />
          </div>
          <div className="md:w-1/2 p-8 text-white">
            <div className="flex items-center mb-2">
              <span className="font-bold text-3xl">{heroProduct.name}</span>
              <div className="ml-3 flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-lg">{heroProduct.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-white/80 mb-4 text-lg">{heroProduct.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                {heroProduct.category}
              </span>
              {heroProduct.tags.map((tag, index) => (
                <span key={index} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            <a 
              href={heroProduct.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-white text-ai-purple px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Explore Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
