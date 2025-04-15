import React from 'react';
import { Info, Users, Award, Globe, Heart, Lightbulb } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutUs = () => {
  const handleSearch = (term: string) => {
    console.log('Search term:', term);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 mt-24">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">About AI Directory</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make artificial intelligence accessible to everyone by curating the best AI tools and resources in one place.
            </p>
          </section>
          
          {/* Our Story */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <Info className="h-8 w-8 text-ai-purple mr-3" />
                <h2 className="text-2xl font-semibold">Our Story</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="mb-4">
                  AI Directory was founded in 2023 by a group of AI enthusiasts who were frustrated with how difficult it was to discover quality AI tools. As artificial intelligence began to transform industries, we noticed that there was no central place to find and compare the growing number of AI solutions.
                </p>
                <p className="mb-4">
                  What started as a simple list of our favorite AI tools quickly evolved into a comprehensive directory with detailed reviews, comparisons, and resources to help both technical and non-technical users navigate the rapidly evolving AI landscape.
                </p>
                <p>
                  Today, AI Directory is one of the leading platforms for discovering artificial intelligence tools and resources, serving thousands of visitors every day who are looking for the best AI solutions for their specific needs.
                </p>
              </div>
            </div>
          </section>
          
          {/* Our Mission */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-ai-purple/10 p-4 rounded-full mb-4">
                    <Lightbulb className="h-8 w-8 text-ai-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Simplify Discovery</h3>
                  <p className="text-gray-600">
                    We curate and organize AI tools to help you find exactly what you need without the overwhelming search.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-ai-purple/10 p-4 rounded-full mb-4">
                    <Award className="h-8 w-8 text-ai-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Promote Quality</h3>
                  <p className="text-gray-600">
                    We thoroughly review each tool to ensure our directory features only the best AI solutions available.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-ai-purple/10 p-4 rounded-full mb-4">
                    <Globe className="h-8 w-8 text-ai-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Educate & Inform</h3>
                  <p className="text-gray-600">
                    We provide resources to help everyone understand and leverage AI technology, regardless of technical expertise.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Values Section */}
          <section className="mb-16">
            <div className="bg-ai-purple text-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-8">
                <Heart className="h-8 w-8 mr-3" />
                <h2 className="text-2xl font-semibold">Our Values</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                  <p>
                    We are committed to being transparent about how we review and recommend AI tools. We clearly disclose any relationships we have with the tools featured in our directory.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Inclusivity</h3>
                  <p>
                    We believe AI should be accessible to everyone. We strive to feature tools that cater to diverse needs and provide resources for users of all skill levels.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Education</h3>
                  <p>
                    We're dedicated to helping our users understand AI technology. We provide educational resources and clear explanations to demystify complex concepts.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                  <p>
                    We celebrate innovation in the AI space. We're constantly on the lookout for groundbreaking tools that push the boundaries of what's possible with artificial intelligence.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Contact CTA */}
          <section>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Have questions, feedback, or want to collaborate? We'd love to hear from you! Reach out to our team and we'll get back to you as soon as possible.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center bg-ai-purple hover:bg-ai-purple/90 text-white px-6 py-3 rounded-md transition-colors"
              >
                Contact Us
              </a>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
