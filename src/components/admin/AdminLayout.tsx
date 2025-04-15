
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  onSearch: (term: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  isAuthenticated, 
  setIsAuthenticated,
  onSearch 
}) => {
  const isMobile = useIsMobile();
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header onSearch={onSearch} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
              
              if (passwordInput.value === 'admin123') {
                setIsAuthenticated(true);
              } else {
                alert('Invalid password');
              }
            }}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter admin password"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-ai-blue hover:bg-ai-purple text-white py-2 px-4 rounded-md"
              >
                Login
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={onSearch} />
      <main className="flex-grow container mx-auto px-4 py-8 mb-8">
        <div className="flex justify-between items-center mb-6 mt-8 md:mt-0">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
          >
            Logout
          </button>
        </div>
        
        {children}
      </main>
      <div className="footer-spacer"></div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
