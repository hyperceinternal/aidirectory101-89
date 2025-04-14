
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryFilter from '@/components/CategoryFilter';
import ProductGrid from '@/components/ProductGrid';
import ProductCTA from '@/components/ProductCTA';
import Footer from '@/components/Footer';
import { fetchAllTools, fetchFeaturedTools, getCategories, filterProducts } from '@/services/aiToolsService';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const isMobile = useIsMobile();
  
  // Fetch all products
  const { data: allProducts = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['allProducts'],
    queryFn: fetchAllTools
  });
  
  // Fetch featured products
  const { data: featuredProducts = [], isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeaturedTools
  });
  
  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
  
  // Filter products based on search term and category
  const { data: filteredProducts = [], isLoading: isLoadingFiltered } = useQuery({
    queryKey: ['filteredProducts', selectedCategory, searchTerm],
    queryFn: () => filterProducts(selectedCategory, searchTerm),
    enabled: selectedCategory !== '' || searchTerm !== ''
  });

  // Determine which products to display
  const displayProducts = (selectedCategory !== '' || searchTerm !== '') 
    ? filteredProducts 
    : allProducts;
  
  // Determine loading state
  const isLoading = isLoadingAll || (isLoadingFiltered && (selectedCategory !== '' || searchTerm !== ''));

  const handleSearch = (term: string) => {
    if (term) {
      navigate(`/search?q=${term}`);
    } else {
      setSearchTerm('');
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      
      <main className="flex-grow page-content px-4 container mx-auto">
        <section className="mb-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ai-dark">
              Discover the Best <span className="text-ai-purple">AI Products</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive directory of AI tools, services, and solutions to find the perfect match for your needs.
            </p>
          </div>
          
          <FeaturedProducts products={featuredProducts} isLoading={isLoadingFeatured} />
          
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect} 
          />
          
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">All AI Products</h2>
            <p className="text-gray-500">
              Showing {displayProducts.length} of {allProducts.length} products
            </p>
          </div>
          
          <ProductGrid products={displayProducts} isLoading={isLoading} />
        </section>
      </main>
      
      <div className="mt-auto">
        <ProductCTA />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
