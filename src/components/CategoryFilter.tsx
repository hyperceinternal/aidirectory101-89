
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <Filter size={18} className="mr-2 text-gray-500" />
        <h2 className="text-lg font-medium">Categories</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "" ? "default" : "outline"}
          onClick={() => onSelectCategory("")}
          className={selectedCategory === "" ? "bg-ai-purple hover:bg-ai-purple/90" : ""}
        >
          All
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onSelectCategory(category)}
            className={selectedCategory === category ? "bg-ai-purple hover:bg-ai-purple/90" : ""}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
