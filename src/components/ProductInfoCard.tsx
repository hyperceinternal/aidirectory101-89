
import React from 'react';
import { Award, Star, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  gradient: string;
  border: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value, subtitle, gradient, border }) => (
  <Card className={`bg-gradient-to-br ${gradient} ${border}`}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
    </CardContent>
  </Card>
);

interface ProductInfoCardsProps {
  rating: number;
  reviewCount: number;
  foundedYear: number;
}

const ProductInfoCards: React.FC<ProductInfoCardsProps> = ({ rating, reviewCount, foundedYear }) => {
  const currentYear = new Date().getFullYear();
  const yearsInIndustry = currentYear - foundedYear;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InfoCard
        icon={<Users className="h-5 w-5 text-primary" />}
        title="User Base"
        value="10,000+"
        subtitle="Active users worldwide"
        gradient="from-primary/5 to-primary/10"
        border="border-primary/20"
      />
      
      <InfoCard
        icon={<Star className="h-5 w-5 text-yellow-500" />}
        title="Rating"
        value={`${rating.toFixed(1)}/5`}
        subtitle={`Based on ${reviewCount} reviews`}
        gradient="from-yellow-50 to-yellow-100/50"
        border="border-yellow-200"
      />
      
      <InfoCard
        icon={<Award className="h-5 w-5 text-blue-500" />}
        title="Experience"
        value={`${yearsInIndustry} years`}
        subtitle={`In the industry since ${foundedYear}`}
        gradient="from-blue-50 to-blue-100/50"
        border="border-blue-200"
      />
    </div>
  );
};

export default ProductInfoCards;
