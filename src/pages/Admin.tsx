
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminToolsPanel from '@/components/admin/AdminToolsPanel';
import AdminSubscribersPanel from '@/components/admin/AdminSubscribersPanel';
import AdminCategoriesPanel from '@/components/admin/AdminCategoriesPanel';
import AdminToolSubmissionsPanel from '@/components/admin/AdminToolSubmissionsPanel';
import AdminContactSubmissionsPanel from '@/components/admin/AdminContactSubmissionsPanel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Simple password protection for admin access
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple admin password - in a real app, use proper authentication
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };
  
  // Handle search
  const handleSearch = (term: string) => {
    if (term) {
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header onSearch={handleSearch} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter admin password"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
      <Header onSearch={handleSearch} />
      <main className="flex-grow container mx-auto px-4 py-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
          >
            Logout
          </button>
        </div>
        
        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tools">AI Tools</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="submissions">Tool Submissions</TabsTrigger>
            <TabsTrigger value="contacts">Contact Messages</TabsTrigger>
            <TabsTrigger value="subscribers">Newsletter Subscribers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tools">
            <AdminToolsPanel />
          </TabsContent>
          
          <TabsContent value="categories">
            <AdminCategoriesPanel />
          </TabsContent>
          
          <TabsContent value="submissions">
            <AdminToolSubmissionsPanel />
          </TabsContent>
          
          <TabsContent value="contacts">
            <AdminContactSubmissionsPanel />
          </TabsContent>
          
          <TabsContent value="subscribers">
            <AdminSubscribersPanel />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
