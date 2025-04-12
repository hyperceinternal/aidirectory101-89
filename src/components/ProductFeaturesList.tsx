
import React from 'react';
import { Check } from 'lucide-react';

interface UseCase {
  title: string;
}

interface ProductFeaturesListProps {
  useCases?: UseCase[];
}

const ProductFeaturesList: React.FC<ProductFeaturesListProps> = ({ useCases = [] }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Key Use Cases</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {useCases.map((useCase, index) => (
          <li key={index} className="flex items-start">
            <div className="mr-2 mt-1 bg-primary/10 rounded-full p-1">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <span>{useCase.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductFeaturesList;
