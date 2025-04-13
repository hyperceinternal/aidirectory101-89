
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Image, Code, Mic } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIProduct } from '@/types/product';
import { fetchRecentlyAddedTools } from '@/services/aiToolsService';

interface ProductSidebarProps {
  websiteUrl?: string;
  categories?: string[];
  onShare?: () => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({ 
  websiteUrl = "#", 
  categories = [], 
  onShare = () => {} 
}) => {
  const [recentTools, setRecentTools] = useState<AIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecentTools = async () => {
      try {
        const tools = await fetchRecentlyAddedTools(3);
        setRecentTools(tools);
      } catch (error) {
        console.error("Failed to load recent tools:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentTools();
  }, []);

  // Function to render the appropriate icon based on tool category
  const getToolIcon = (tool: AIProduct) => {
    const category = tool.category.toLowerCase();
    
    if (category.includes('image') || category.includes('visual')) {
      return <Image className="h-4 w-4" />;
    } else if (category.includes('code') || category.includes('developer')) {
      return <Code className="h-4 w-4" />;
    } else if (category.includes('voice') || category.includes('audio')) {
      return <Mic className="h-4 w-4" />;
    }
    
    // Default icon based on first letter of tool name
    return <span className="text-xs font-medium">{tool.name.charAt(0)}</span>;
  };

  return (
    <div className="sticky top-24 h-fit z-0">
      <div className="space-y-6">
        <Card>
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
              {categories.map((category, index) => (
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
            {isLoading ? (
              // Loading state
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-md animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
                </div>
              ))
            ) : recentTools.length > 0 ? (
              // Display recent tools
              recentTools.map((tool) => (
                <Link 
                  key={tool.id} 
                  to={`/tool/${tool.slug}`} 
                  className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                    {tool.image ? (
                      <img src={tool.image} alt={tool.name} className="w-8 h-8 object-contain" />
                    ) : (
                      getToolIcon(tool)
                    )}
                  </div>
                  <span className="font-medium text-gray-800">{tool.name}</span>
                </Link>
              ))
            ) : (
              // No tools found
              <p className="text-gray-500 text-sm">No recent tools available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductSidebar;
