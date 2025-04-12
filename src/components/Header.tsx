
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-ai-dark">
            <span className="text-ai-purple">AI</span>Directory
          </h1>
        </div>

        <div className="w-full md:w-1/3 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search AI products..." 
              className="pl-10 w-full"
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-ai-purple transition-colors">Home</a>
          <a href="#" className="text-gray-600 hover:text-ai-purple transition-colors">Categories</a>
          <a href="#" className="text-gray-600 hover:text-ai-purple transition-colors">New Products</a>
          <a href="#" className="text-gray-600 hover:text-ai-purple transition-colors">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
