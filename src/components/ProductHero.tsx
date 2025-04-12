
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Users, Calendar } from 'lucide-react';
import { AIProduct } from '@/types/product';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductHeroProps {
  product: AIProduct;
}

const ProductHero: React.FC<ProductHeroProps> = ({ product }) => {
  return (
    <div className="relative bg-gradient-to-b from-primary/10 to-white">
      {/* Add padding-top to prevent overlap with the header */}
      <div className="container mx-auto px-4 py-12 pt-28">
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
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
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
              <span>Founded 2021</span>
            </div>
          </div>

          {/* Add z-index to ensure buttons are above the wave */}
          <div className="flex justify-center relative z-10">
            <Button size="lg" asChild>
              <a href={product.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Try {product.name} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Wave Divider - with lower z-index */}
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
  );
};

export default ProductHero;
