
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
  content: Record<string, string>;
  updated_at: string;
};

const AdminPagesPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = React.useState<string | null>(null);
  const [editableContent, setEditableContent] = React.useState<Record<string, string>>({});

  const { data: pages, isLoading } = useQuery({
    queryKey: ['page-contents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .order('page_name');
      
      if (error) throw error;
      return data as PageContent[];
    }
  });

  const updatePageMutation = useMutation({
    mutationFn: async ({ pageId, content }: { pageId: string; content: Record<string, string> }) => {
      const { error } = await supabase
        .from('page_contents')
        .update({ content })
        .eq('id', pageId);
      
      if (error) throw error;
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
    setSelectedPage(page.id);
    setEditableContent(page.content);
  };

  const handleContentChange = (key: string, value: string) => {
    setEditableContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    if (!selectedPage) return;
    updatePageMutation.mutate({
      pageId: selectedPage,
      content: editableContent
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Pages</h3>
        <ScrollArea className="h-[600px]">
          <div className="space-y-2">
            {pages?.map((page) => (
              <Button
                key={page.id}
                variant={selectedPage === page.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handlePageSelect(page)}
              >
                {page.page_name.charAt(0).toUpperCase() + page.page_name.slice(1)}
              </Button>
            ))}
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
                {value.length > 100 ? (
                  <Textarea
                    value={value}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    className="min-h-[100px]"
                  />
                ) : (
                  <Input
                    value={value}
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
