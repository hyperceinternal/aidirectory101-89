
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminToolsPanel from '@/components/admin/AdminToolsPanel';
import AdminSubscribersPanel from '@/components/admin/AdminSubscribersPanel';
import AdminCategoriesPanel from '@/components/admin/AdminCategoriesPanel';
import AdminToolSubmissionsPanel from '@/components/admin/AdminToolSubmissionsPanel';
import AdminContactSubmissionsPanel from '@/components/admin/AdminContactSubmissionsPanel';
import AdminPagesPanel from '@/components/admin/AdminPagesPanel';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminTabs: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs defaultValue="tools" className="w-full">
      <TabsList className={`mb-6 ${isMobile ? 'flex-wrap' : ''}`}>
        <TabsTrigger value="tools">AI Tools</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="submissions">Tool Submissions</TabsTrigger>
        <TabsTrigger value="contacts">Contact Messages</TabsTrigger>
        <TabsTrigger value="subscribers">Newsletter Subscribers</TabsTrigger>
        <TabsTrigger value="pages">Pages</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tools" className="pb-8">
        <AdminToolsPanel />
      </TabsContent>
      
      <TabsContent value="categories" className="pb-8">
        <AdminCategoriesPanel />
      </TabsContent>
      
      <TabsContent value="submissions" className="pb-8">
        <AdminToolSubmissionsPanel />
      </TabsContent>
      
      <TabsContent value="contacts" className="pb-8">
        <AdminContactSubmissionsPanel />
      </TabsContent>
      
      <TabsContent value="subscribers" className="pb-8">
        <AdminSubscribersPanel />
      </TabsContent>
      
      <TabsContent value="pages" className="pb-8">
        <AdminPagesPanel />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
