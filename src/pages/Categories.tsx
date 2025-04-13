
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Grid, Rows3 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import ProductGrid from '@/components/ProductGrid';
import { getCategories, filterProducts } from '@/services/aiToolsService';
import { useQuery } from '@tanstack/react-query';

const Categories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Fetch categories from Supabase
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  // Fetch filtered products based on selected category
  const { data: filteredProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => filterProducts(selectedCategory),
    enabled: !!selectedCategory
  });

  const handleCategorySelect = (category: string) => {
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
            {categoriesLoading ? (
              // Loading state for categories
              Array(8).fill(0).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              categories.map((category) => (
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
                      Browse tools in this category
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
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
              isLoading={productsLoading} 
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
