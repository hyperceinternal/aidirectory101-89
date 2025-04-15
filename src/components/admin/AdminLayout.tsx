
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  onSearch: (term: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  onSearch 
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={onSearch} />
      <main className="flex-grow container mx-auto px-4 py-8 mb-8">
        {children}
      </main>
      <div className="footer-spacer"></div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
