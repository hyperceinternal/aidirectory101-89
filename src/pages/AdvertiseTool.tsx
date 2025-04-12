
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Check, Megaphone, Mail, Instagram, Twitter, Facebook, Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdvertiseTool = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSearch = (term: string) => {
    if (term) {
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  const handleGetStarted = (plan: string) => {
    toast({
      title: "Contact request received",
      description: `We'll be in touch about the ${plan} plan soon!`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <Megaphone className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm font-medium">Boost your visibility</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Advertise Your AI Tool</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Get your AI tool in front of thousands of potential users, decision-makers, and AI enthusiasts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center">
                <div className="p-1 bg-green-100 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="ml-2">10,000+ monthly visitors</span>
              </div>
              <div className="flex items-center">
                <div className="p-1 bg-green-100 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="ml-2">AI-focused audience</span>
              </div>
              <div className="flex items-center">
                <div className="p-1 bg-green-100 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="ml-2">Cross-platform promotion</span>
              </div>
            </div>
          </div>

          {/* Channels Section */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-center mb-12">Our Promotional Channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PromotionChannel 
                icon={<Globe className="h-10 w-10 text-ai-purple" />}
                title="Website Placement"
                description="Featured placement on our homepage, category pages, and search results for maximum visibility."
              />
              <PromotionChannel 
                icon={<Mail className="h-10 w-10 text-ai-blue" />}
                title="Newsletter Features"
                description="Dedicated mentions in our weekly newsletter reaching thousands of AI enthusiasts."
              />
              <PromotionChannel 
                icon={<div className="flex space-x-2">
                  <Twitter className="h-10 w-10 text-ai-blue" />
                  <Instagram className="h-10 w-10 text-ai-purple" />
                </div>}
                title="Social Media"
                description="Promotional posts across our social media channels with 15K+ combined followers."
              />
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-center mb-4">Promotional Packages</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              Choose the perfect promotional package to increase visibility for your AI tool.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard 
                title="Basic"
                price="$199"
                period="/month"
                description="Essential promotion for new AI tools looking to build visibility."
                features={[
                  "Standard listing in directory",
                  "Social media mention (1x)",
                  "Newsletter mention",
                  "30 days featured in 'New Tools'"
                ]}
                buttonText="Get Started"
                onClick={() => handleGetStarted('Basic')}
              />
              
              <PricingCard 
                title="Premium"
                price="$499"
                period="/month"
                description="Comprehensive promotion for established tools seeking growth."
                features={[
                  "Premium listing with badge",
                  "Homepage featured placement (1 week)",
                  "Social media promotion (3x)",
                  "Newsletter feature section",
                  "Category page top placement"
                ]}
                buttonText="Get Started"
                highlighted={true}
                onClick={() => handleGetStarted('Premium')}
              />
              
              <PricingCard 
                title="Enterprise"
                price="$999"
                period="/month"
                description="Maximum exposure for industry-leading AI tools."
                features={[
                  "Priority placement throughout site",
                  "Permanent homepage featured section",
                  "Weekly social media promotion",
                  "Featured case study article",
                  "Newsletter dedicated section",
                  "Banner promotion on all pages"
                ]}
                buttonText="Get Started"
                onClick={() => handleGetStarted('Enterprise')}
              />
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-ai-purple/10 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to promote your AI tool?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Contact our team today to discuss a custom promotional package tailored to your specific needs.
              </p>
              <Button 
                size="lg" 
                onClick={() => handleGetStarted('Custom')}
                className="px-8"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface PromotionChannelProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PromotionChannel: React.FC<PromotionChannelProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
  onClick: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  buttonText, 
  highlighted = false,
  onClick
}) => (
  <Card className={`flex flex-col h-full ${highlighted ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}>
    <CardHeader>
      <div className="text-center">
        {highlighted && (
          <Badge className="mb-2 mx-auto">Most Popular</Badge>
        )}
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="mt-4 flex items-baseline justify-center">
          <span className="text-3xl font-extrabold">{price}</span>
          <span className="ml-1 text-gray-500">{period}</span>
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-gray-600 text-center mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button 
        className="w-full" 
        variant={highlighted ? "default" : "outline"}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </CardFooter>
  </Card>
);

export default AdvertiseTool;
