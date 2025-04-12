
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ai-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-ai-purple">AI</span>Directory
            </h3>
            <p className="text-gray-300 mb-4">
              Discover cutting-edge AI tools and solutions for every need. The most comprehensive directory of AI products.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Browse Categories</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Featured Products</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">New Releases</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Language Models</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Image Generation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Content Creation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Developer Tools</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: info@aidirectory.com</li>
              <li className="text-gray-300">Twitter: @AIdirectory</li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Submit a Product</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Advertise with Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} AI Directory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
