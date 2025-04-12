
import React from 'react';
import { Link } from 'react-router-dom';

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
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white transition-colors">Browse Categories</Link></li>
              <li><Link to="/search" className="text-gray-300 hover:text-white transition-colors">Search</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/categories" className="text-gray-300 hover:text-white transition-colors">Language Models</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white transition-colors">Image Generation</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white transition-colors">Content Creation</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white transition-colors">Developer Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: info@aidirectory.com</li>
              <li className="text-gray-300">Twitter: @AIdirectory</li>
              <li><Link to="/submit" className="text-gray-300 hover:text-white transition-colors">Submit a Product</Link></li>
              <li><Link to="/advertise" className="text-gray-300 hover:text-white transition-colors">Advertise with Us</Link></li>
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
