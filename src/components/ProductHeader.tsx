
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Share2, Bookmark } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProductHeaderProps {
  name?: string;
  logo?: string;
  websiteUrl?: string;
  onShare?: () => void;
  onSave?: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ 
  name = "AI Tool", 
  logo = "/placeholder.svg", 
  websiteUrl = "#",
  onShare = () => {},
  onSave = () => {}
}) => {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/categories"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to all tools
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md overflow-hidden">
              <img
                src={logo}
                alt={`${name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium">{name}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex items-center gap-1"
            onClick={onSave}
          >
            <Bookmark className="h-4 w-4" />
            Save
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex items-center gap-1"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            Share
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
