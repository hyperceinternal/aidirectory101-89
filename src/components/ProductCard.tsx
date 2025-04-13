
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink } from 'lucide-react';
import { AIProduct } from '@/types/product';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ProductCardProps {
  product: AIProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Use slug for the URL
  const toolPath = product.slug || product.id;
  
  return (
    <Link to={`/tool/${toolPath}`} className="block h-full">
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg animate-scale-in">
        <CardHeader className="p-0">
          <div className="relative h-40 bg-gray-100 flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="object-cover w-full h-full"
            />
            {product.featured && (
              <Badge className="absolute top-2 right-2 bg-ai-purple">
                Featured
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-ai-dark">{product.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
              {product.category}
            </Badge>
            {product.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className="text-sm text-gray-500">{product.pricingModel}</span>
          <a 
            href={product.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-ai-blue hover:text-ai-purple text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Visit <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
