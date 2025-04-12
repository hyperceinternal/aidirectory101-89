
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCategories, filterProducts } from '@/services/aiToolsService';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
  
  // Fetch filtered products
  const { data: filteredProducts = [], isLoading } = useQuery({
    queryKey: ['searchProducts', initialQuery, initialCategory],
    queryFn: () => filterProducts(initialCategory, initialQuery),
    enabled: initialQuery !== '' || initialCategory !== ''
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL parameters
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    
    setSearchParams(params);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    // Update category and URL parameters
    setSelectedCategory(category);
    
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    setSearchParams(params);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSearchParams({});
  };

  // Header search redirects to search page
  const headerSearch = (term: string) => {
    if (term) {
      navigate(`/search?q=${term}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={headerSearch} />
      
      <main className="flex-grow pt-24 px-4 container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-ai-dark">Search AI Tools</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Filter size={18} className="mr-2" />
                Filters
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-700">Search</h3>
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input 
                        type="text" 
                        placeholder="Search AI tools..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </form>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-700">Categories</h3>
                  <div className="space-y-2">
                    <CategoryFilter 
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onSelectCategory={handleCategorySelect}
                    />
                  </div>
                </div>
                
                {(searchTerm || selectedCategory) && (
                  <div className="pt-4 border-t border-gray-100">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center" 
                      onClick={clearFilters}
                    >
                      <X size={16} className="mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-wrap items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Results {initialQuery && <span>for "{initialQuery}"</span>}
                </h2>
                <span className="text-gray-500 text-sm">
                  Found {filteredProducts.length} tools
                </span>
              </div>
              
              {selectedCategory && (
                <div className="mt-3 flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Category:</span>
                  <Badge className="bg-ai-purple">
                    {selectedCategory}
                    <X 
                      size={14} 
                      className="ml-1 cursor-pointer" 
                      onClick={() => handleCategorySelect('')} 
                    />
                  </Badge>
                </div>
              )}
            </div>
            
            <ProductGrid products={filteredProducts} isLoading={isLoading} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
