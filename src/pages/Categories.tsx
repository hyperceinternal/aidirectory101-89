
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Grid, Rows3 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { getCategories, filterProducts } from '@/data/products';
import ProductGrid from '@/components/ProductGrid';

const Categories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const categories = getCategories();
  const filteredProducts = filterProducts(selectedCategory);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const handleCategorySelect = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
  };

  const handleSearch = (term: string) => {
    if (term) {
      navigate(`/search?q=${term}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      
      <main className="flex-grow pt-24 px-4 container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-ai-dark">Categories</h1>
          <p className="text-gray-600">Browse AI tools by category to find exactly what you need.</p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            {selectedCategory 
              ? `Showing ${filteredProducts.length} tools in "${selectedCategory}"`
              : `${categories.length} categories available`}
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              aria-label="List view"
            >
              <Rows3 size={18} />
            </button>
          </div>
        </div>

        {!selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card 
                key={category} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCategorySelect(category)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">{category}</h3>
                    <Layout className="text-ai-purple" size={20} />
                  </div>
                  <p className="text-sm text-gray-500">
                    {filterProducts(category).length} tools
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <button
              className="mb-6 flex items-center text-ai-purple hover:underline"
              onClick={() => setSelectedCategory("")}
            >
              ← Back to all categories
            </button>
            <h2 className="text-2xl font-bold mb-6">{selectedCategory}</h2>
            <ProductGrid 
              products={filteredProducts} 
              isLoading={isLoading} 
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
