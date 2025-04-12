
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductSidebarProps {
  websiteUrl: string;
  categories: string[];
  onShare: () => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({ websiteUrl, categories, onShare }) => {
  return (
    <div className="space-y-6">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Visit Website
            </a>
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            Share Tool
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Related Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[...categories, "AI Tools", "Productivity Tools", "Content Creation"].map((category, index) => (
              <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently Added Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {["AI Image Generator", "Code Assistant", "Voice Transcription"].map((name, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-xs font-medium">{name.charAt(0)}</span>
              </div>
              <span>{name}</span>
            </div>
          ))}
          <Button variant="link" className="w-full p-0">
            View All New Tools
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductSidebar;
