
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubmitToolForm from '@/components/SubmitToolForm';

const SubmitTool = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSearch = (term: string) => {
    if (term) {
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  const handleSubmitSuccess = () => {
    toast({
      title: "Tool submitted successfully",
      description: "Thank you for your submission. Our team will review it shortly.",
    });
    
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      <main className="flex-grow page-content pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit an AI Tool</h1>
              <p className="text-gray-600">
                Share an innovative AI tool with our community. Please provide detailed information to help users understand the tool's capabilities.
              </p>
            </div>
            
            <SubmitToolForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitTool;
