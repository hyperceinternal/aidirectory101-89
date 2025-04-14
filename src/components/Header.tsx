
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Megaphone, MessageSquare, Info, Menu, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-ai-dark">
              <span className="text-ai-purple">AI</span>Directory
            </Link>
          </div>

          {isMobile ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="md:hidden"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-ai-purple transition-colors">Home</Link>
              <Link to="/categories" className="text-gray-600 hover:text-ai-purple transition-colors">Categories</Link>
              <Link to="/about" className="text-gray-600 hover:text-ai-purple transition-colors flex items-center gap-1">
                <Info size={16} />
                About Us
              </Link>
              <Link to="/submit" className="text-gray-600 hover:text-ai-purple transition-colors flex items-center gap-1">
                <PlusCircle size={16} />
                Submit Tool
              </Link>
              <Link to="/advertise" className="text-gray-600 hover:text-ai-purple transition-colors flex items-center gap-1">
                <Megaphone size={16} />
                Advertise
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-ai-purple transition-colors flex items-center gap-1">
                <MessageSquare size={16} />
                Contact
              </Link>
            </div>
          )}
        </div>

        <div className="w-full mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="text" 
            placeholder="Search AI products..." 
            className="pl-10 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
          />
        </div>

        {isMobile && isMenuOpen && (
          <div className="md:hidden mt-4 bg-white border-t border-gray-100 py-2">
            <nav className="flex flex-col space-y-3 pt-2">
              <Link to="/" className="text-gray-600 hover:text-ai-purple transition-colors py-2">Home</Link>
              <Link to="/categories" className="text-gray-600 hover:text-ai-purple transition-colors py-2">Categories</Link>
              <Link to="/about" className="text-gray-600 hover:text-ai-purple transition-colors py-2 flex items-center gap-1">
                <Info size={16} />
                About Us
              </Link>
              <Link to="/submit" className="text-gray-600 hover:text-ai-purple transition-colors py-2 flex items-center gap-1">
                <PlusCircle size={16} />
                Submit Tool
              </Link>
              <Link to="/advertise" className="text-gray-600 hover:text-ai-purple transition-colors py-2 flex items-center gap-1">
                <Megaphone size={16} />
                Advertise
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-ai-purple transition-colors py-2 flex items-center gap-1">
                <MessageSquare size={16} />
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
