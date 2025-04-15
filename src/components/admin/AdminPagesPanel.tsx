
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type PageContent = {
  id: string;
  page_name: string;
  content: Record<string, any>;
  updated_at: string;
};

const AdminPagesPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = React.useState<string | null>(null);
  const [editableContent, setEditableContent] = React.useState<Record<string, string>>({});

  console.log('AdminPagesPanel rendering');

  const { data: pages, isLoading, error } = useQuery({
    queryKey: ['page-contents'],
    queryFn: async () => {
      console.log('Fetching pages from Supabase');
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .order('page_name');
      
      if (error) {
        console.error('Error fetching pages:', error);
        throw error;
      }
      
      console.log('Pages fetched:', data);
      return data as PageContent[];
    }
  });

  const updatePageMutation = useMutation({
    mutationFn: async ({ pageId, content }: { pageId: string; content: Record<string, any> }) => {
      // Convert string values back to their appropriate types if needed
      const processedContent: Record<string, any> = {};
      
      Object.entries(content).forEach(([key, value]) => {
        // Try to convert numerical strings to numbers
        if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
          const num = Number(value);
          if (Number.isInteger(num)) {
            processedContent[key] = num;
          } else {
            processedContent[key] = value;
          }
        } else {
          processedContent[key] = value;
        }
      });
      
      const { error } = await supabase
        .from('page_contents')
        .update({ content: processedContent })
        .eq('id', pageId);
      
      if (error) {
        console.error('Error updating page:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-contents'] });
      toast({
        title: "Success",
        description: "Page content updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update page content",
        variant: "destructive",
      });
      console.error('Error updating page:', error);
    }
  });

  const handlePageSelect = (page: PageContent) => {
    console.log('Selected page:', page);
    // Convert JSONB content to Record<string, string>
    const stringContent: Record<string, string> = {};
    
    if (page.content) {
      Object.entries(page.content).forEach(([key, value]) => {
        stringContent[key] = String(value);
      });
    } else {
      console.warn('Page has no content or content is null');
    }
    
    setSelectedPage(page.id);
    setEditableContent(stringContent);
  };

  const handleContentChange = (key: string, value: string) => {
    setEditableContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    if (!selectedPage) return;
    
    console.log('Saving content:', editableContent);
    updatePageMutation.mutate({
      pageId: selectedPage,
      content: editableContent
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading pages: {(error as Error).message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Pages</h3>
        <ScrollArea className="h-[600px]">
          <div className="space-y-2">
            {pages && pages.length > 0 ? (
              pages.map((page) => (
                <Button
                  key={page.id}
                  variant={selectedPage === page.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handlePageSelect(page)}
                >
                  {page.page_name.charAt(0).toUpperCase() + page.page_name.slice(1)}
                </Button>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-4">
                No pages found. Please run the SQL to create sample pages.
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      <Card className="md:col-span-2 p-4">
        <h3 className="font-semibold mb-4">Edit Content</h3>
        {selectedPage ? (
          <div className="space-y-4">
            {Object.entries(editableContent).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </label>
                {typeof value === 'string' && value.length > 100 ? (
                  <Textarea
                    value={value}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    className="min-h-[100px]"
                  />
                ) : (
                  <Input
                    value={String(value)}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                  />
                )}
              </div>
            ))}
            <Button 
              onClick={handleSave}
              disabled={updatePageMutation.isPending}
              className="mt-4"
            >
              Save Changes
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">Select a page to edit its content</p>
        )}
      </Card>
    </div>
  );
};

export default AdminPagesPanel;
