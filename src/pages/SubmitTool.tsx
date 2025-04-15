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
      
      <main className="flex-grow page-content container mx-auto px-4">
        <section className="mb-12 pt-32">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ai-dark">Submit an AI Tool</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Share an innovative AI tool with our community. Please provide detailed information to help users understand the tool's capabilities.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SubmitToolForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubmitTool;
