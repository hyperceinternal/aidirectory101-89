import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AIProduct } from '@/types/product';
import { aiProducts } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Zap, Globe, Shield, BarChart, Check, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductHeader from '@/components/ProductHeader';
import ProductHero from '@/components/ProductHero';
import ProductInfoCards from '@/components/ProductInfoCard';
import ProductFeaturesList from '@/components/ProductFeaturesList';
import ProductSidebar from '@/components/ProductSidebar';
import ProductCTA from '@/components/ProductCTA';

const renderIcon = (iconName: string) => {
  const icons = {
    Zap: <Zap className="h-5 w-5 text-primary" />,
    Globe: <Globe className="h-5 w-5 text-primary" />,
    Shield: <Shield className="h-5 w-5 text-primary" />,
    BarChart: <BarChart className="h-5 w-5 text-primary" />,
  };

  return icons[iconName as keyof typeof icons] || <Zap className="h-5 w-5 text-primary" />;
};

const AIToolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<AIProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<AIProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const foundProduct = aiProducts.find(p => p.id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      const related = aiProducts
        .filter(p => p.id !== id && 
          (p.category === foundProduct.category || 
           p.tags.some(tag => foundProduct.tags.includes(tag)))
        )
        .slice(0, 3);
      
      setRelatedProducts(related);
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header onSearch={(term) => navigate(`/search?q=${term}`)} />
        <div className="animate-pulse h-20 bg-white"></div>
        <div className="animate-pulse h-80 bg-primary/10"></div>
        <main className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-12 w-96 mb-8" />
              <Skeleton className="h-[600px] w-full" />
            </div>
            <div>
              <Skeleton className="h-80 w-full mb-6" />
              <Skeleton className="h-60 w-full mb-6" />
              <Skeleton className="h-60 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearch={(term) => navigate(`/search?q=${term}`)} />
        <main className="flex-grow pt-24 px-4 container mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The AI tool you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button>
                Back to Homepage
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const useCases = [
    { title: "Content creation for blogs and social media" },
    { title: "Academic research and paper writing" },
    { title: "Email drafting and communication" },
    { title: "Creative writing and storytelling" },
    { title: "Business documentation and reports" },
  ];

  const features = product.tags.map(tag => ({
    name: `${tag} functionality`,
    description: `Advanced capabilities for ${tag.toLowerCase()} tasks.`,
    icon: ["Zap", "Globe", "Shield", "BarChart"][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onSearch={(term) => navigate(`/search?q=${term}`)} />
      
      <ProductHeader 
        name={product.name} 
        logo={product.image} 
        websiteUrl={product.url} 
      />
      
      <ProductHero product={product} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-8 w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview" className="px-6">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="features" className="px-6">
                  Features
                </TabsTrigger>
                <TabsTrigger value="screenshots" className="px-6">
                  Screenshots
                </TabsTrigger>
                <TabsTrigger value="pricing" className="px-6">
                  Pricing
                </TabsTrigger>
                <TabsTrigger value="alternatives" className="px-6">
                  Alternatives
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">About {product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {product.name} is a cutting-edge artificial intelligence tool designed to enhance productivity and creativity. 
                      It leverages the latest advancements in natural language processing to provide assistance with 
                      {product.tags.map(tag => ` ${tag.toLowerCase()}`).join(',')}. 
                      Whether you're a professional writer, marketer, student, or just someone looking to streamline your workflow, 
                      {product.name} offers the features you need.
                    </p>

                    <ProductFeaturesList useCases={useCases} />
                  </CardContent>
                </Card>

                <ProductInfoCards 
                  rating={product.rating} 
                  reviewCount={product.reviewCount || 328} 
                  foundedYear={2021} 
                />
              </TabsContent>

              <TabsContent value="features" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Key Features</CardTitle>
                    <CardDescription>Discover what makes {product.name} stand out from the competition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-8">
                      {features.map((feature, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            {renderIcon(feature.icon)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{feature.name}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="md:w-1/4 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                          <Download className="h-10 w-10 text-primary" />
                        </div>
                      </div>
                      <div className="md:w-3/4 text-center md:text-left">
                        <h3 className="text-xl font-semibold mb-2">Ready to experience {product.name}?</h3>
                        <p className="text-gray-600 mb-4">
                          Join thousands of satisfied users and transform your workflow today.
                        </p>
                        <Button asChild>
                          <a href={product.url} target="_blank" rel="noopener noreferrer">
                            Get Started for Free
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="screenshots" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Screenshots & Interface</CardTitle>
                    <CardDescription>Take a visual tour of {product.name}'s interface and features</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Screenshots coming soon!</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Pricing Plans</CardTitle>
                    <CardDescription>{product.name} offers flexible pricing options to suit your needs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Pricing information coming soon!</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alternatives" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Similar Tools</CardTitle>
                    <CardDescription>Compare {product.name} with alternatives</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {relatedProducts.map((alt) => (
                        <Link key={alt.id} to={`/tool/${alt.id}`}>
                          <div className="flex items-center gap-4 p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <img
                              src={alt.image}
                              alt={`${alt.name} logo`}
                              className="w-12 h-12 rounded-md object-contain"
                            />
                            <div className="flex-grow">
                              <h3 className="font-medium text-lg">{alt.name}</h3>
                              <p className="text-sm text-gray-600">Alternative to {product.name}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <ProductSidebar 
              websiteUrl={product.url} 
              categories={[product.category]} 
            />
          </div>
        </div>
      </main>
      
      <ProductCTA 
        productName={product.name} 
        websiteUrl={product.url} 
      />
      
      <Footer />
    </div>
  );
};

export default AIToolDetails;
