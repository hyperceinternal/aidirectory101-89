
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminLogin from '@/components/admin/AdminLogin';
import { useToast } from "@/hooks/use-toast";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSearch = (term: string) => {
    if (term) {
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  const handleLogin = (password: string) => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Successfully logged in to admin panel",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Success",
      description: "Successfully logged out",
    });
  };
  
  if (!isAuthenticated) {
    return (
      <AdminLayout 
        isAuthenticated={false}
        setIsAuthenticated={setIsAuthenticated}
        onSearch={handleSearch}
      >
        <AdminLogin onLogin={handleLogin} />
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout 
      isAuthenticated={isAuthenticated} 
      setIsAuthenticated={setIsAuthenticated}
      onSearch={handleSearch}
    >
      <AdminNavbar onLogout={handleLogout} />
      <AdminTabs />
    </AdminLayout>
  );
};

export default Admin;
