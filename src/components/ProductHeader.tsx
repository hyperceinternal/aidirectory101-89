
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
  name?: string;
  logo?: string;
  websiteUrl?: string;
  onShare?: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ 
  name = "AI Tool", 
  logo = "/placeholder.svg", 
  websiteUrl = "#",
  onShare = () => {}
}) => {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/categories"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to all tools
          </Link>
          
          <div className="ml-6 font-medium">
            {name}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            Save
          </Button>
          
          <Button size="sm" asChild>
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <ExternalLink className="h-4 w-4" />
              Visit Website
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
