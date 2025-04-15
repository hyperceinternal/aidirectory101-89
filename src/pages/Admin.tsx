
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTabs from '@/components/admin/AdminTabs';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (term: string) => {
    if (term) {
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
  };
  
  return (
    <AdminLayout 
      isAuthenticated={isAuthenticated} 
      setIsAuthenticated={setIsAuthenticated}
      onSearch={handleSearch}
    >
      <AdminTabs />
    </AdminLayout>
  );
};

export default Admin;
