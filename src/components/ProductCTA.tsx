
import React from 'react';
import { Button } from "@/components/ui/button";

interface ProductCTAProps {
  productName: string;
  websiteUrl: string;
}

const ProductCTA: React.FC<ProductCTAProps> = ({ productName, websiteUrl }) => {
  return (
    <div className="bg-gradient-to-r from-primary/20 to-primary/5 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your workflow?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of professionals who use {productName} to boost their productivity and creativity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                Get Started for Free
              </a>
            </Button>
            <Button variant="outline" size="lg">
              Compare Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCTA;
