import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAllTools, 
  createTool, 
  updateTool, 
  deleteTool,
  createTag,
  createUseCase,
  fetchCategories
} from '@/services/adminService';
import { AIProduct, UseCase } from '@/types/product';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Plus, Trash2, X, Upload, Database } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateSupabaseCredentials } from "@/integrations/supabase/client";

const AdminToolsPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState<Partial<AIProduct> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newUseCase, setNewUseCase] = useState<Partial<UseCase>>({ title: '', description: '' });
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isSupabaseDialogOpen, setIsSupabaseDialogOpen] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  const { data: tools, isLoading } = useQuery({
    queryKey: ['admin', 'tools'],
    queryFn: fetchAllTools
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: fetchCategories
  });

  const createToolMutation = useMutation({
    mutationFn: createTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tools'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast({
        title: "Success",
        description: "Tool created successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tool",
        variant: "destructive"
      });
    }
  });

  const updateToolMutation = useMutation({
    mutationFn: updateTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tools'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast({
        title: "Success",
        description: "Tool updated successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update tool",
        variant: "destructive"
      });
    }
  });

  const deleteToolMutation = useMutation({
    mutationFn: deleteTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tools'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast({
        title: "Success",
        description: "Tool deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete tool",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setCurrentTool(null);
    setIsEditing(false);
    setIsAddDialogOpen(false);
    setTags([]);
    setUseCases([]);
    setNewCategory('');
    setIsNewCategory(false);
    setImageFile(null);
    setLogoFile(null);
    setImagePreview('');
    setLogoPreview('');
  };

  const handleEditTool = (tool: AIProduct) => {
    setCurrentTool(tool);
    setTags(tool.tags || []);
    setUseCases(tool.useCases || []);
    setIsEditing(true);
    setIsAddDialogOpen(true);
    setImagePreview(tool.image || '');
    setLogoPreview(tool.logoUrl || '');
  };

  const handleAddNewTool = () => {
    setCurrentTool({
      name: '',
      description: '',
      shortDescription: '',
      category: '',
      url: '',
      image: '',
      logoUrl: '',
      tags: [],
      rating: 0,
      pricingModel: 'Free',
      featured: false
    });
    setTags([]);
    setUseCases([]);
    setIsEditing(false);
    setIsAddDialogOpen(true);
    setImagePreview('');
    setLogoPreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentTool || !currentTool.name || !currentTool.description) {
      toast({
        title: "Validation Error",
        description: "Name and description are required",
        variant: "destructive"
      });
      return;
    }
    
    if (isNewCategory && newCategory) {
      currentTool.category = newCategory;
    }
    
    if (!currentTool.category) {
      toast({
        title: "Validation Error",
        description: "Category is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const toolData = {
        ...currentTool,
        tags,
        useCases,
        imageFile: imageFile || currentTool.image,
        logoFile: logoFile || currentTool.logoUrl
      } as AIProduct & { imageFile?: File | string; logoFile?: File | string };
      
      if (isEditing && currentTool.id) {
        await updateToolMutation.mutateAsync(toolData);
      } else {
        await createToolMutation.mutateAsync(toolData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      setIsNewCategory(true);
      setCurrentTool({...currentTool, category: ''});
    } else {
      setIsNewCategory(false);
      setCurrentTool({...currentTool, category: value});
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddUseCase = () => {
    if (newUseCase.title && newUseCase.description) {
      setUseCases([...useCases, newUseCase as UseCase]);
      setNewUseCase({ title: '', description: '' });
    }
  };

  const handleRemoveUseCase = (index: number) => {
    setUseCases(useCases.filter((_, i) => i !== index));
  };

  const handleDeleteTool = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        await deleteToolMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting tool:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button 
          variant="outline" 
          onClick={() => setIsSupabaseDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Database className="h-4 w-4" /> Connect Supabase
        </Button>
        <Button onClick={handleAddNewTool}>
          <Plus className="mr-1 h-4 w-4" /> Add New Tool
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools && tools.length > 0 ? (
                tools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell>{tool.category}</TableCell>
                    <TableCell>{tool.rating.toFixed(1)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {tool.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                        {tool.tags.length > 3 && (
                          <Badge variant="outline">+{tool.tags.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {tool.featured ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditTool(tool)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteTool(tool.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No tools found. Add your first tool.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>
              {isEditing ? 'Edit Tool' : 'Add New Tool'}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[70vh] px-6">
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input 
                    id="name" 
                    value={currentTool?.name || ''} 
                    onChange={(e) => setCurrentTool({...currentTool, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={isNewCategory ? "new" : currentTool?.category || ''}
                    onValueChange={handleCategoryChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categoriesLoading ? (
                          <SelectItem value="loading">Loading categories...</SelectItem>
                        ) : (
                          <>
                            {categories && categories.map((category, index) => (
                              <SelectItem key={index} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                            <SelectItem value="new">+ Add new category</SelectItem>
                          </>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  
                  {isNewCategory && (
                    <div className="mt-2">
                      <Input 
                        placeholder="Enter new category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url">URL *</Label>
                  <Input 
                    id="url" 
                    type="url"
                    value={currentTool?.url || ''} 
                    onChange={(e) => setCurrentTool({...currentTool, url: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL friendly name) *</Label>
                  <Input 
                    id="slug" 
                    value={currentTool?.slug || ''} 
                    onChange={(e) => setCurrentTool({...currentTool, slug: e.target.value})}
                    placeholder="e.g. tool-name"
                    required
                  />
                  <p className="text-xs text-gray-500">This will be used in the URL: /tool/your-slug</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input 
                    id="rating" 
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={currentTool?.rating || 0} 
                    onChange={(e) => setCurrentTool({...currentTool, rating: parseFloat(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pricingModel">Pricing Model</Label>
                  <Input 
                    id="pricingModel" 
                    value={currentTool?.pricingModel || ''} 
                    onChange={(e) => setCurrentTool({...currentTool, pricingModel: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input 
                    id="foundedYear" 
                    type="number"
                    value={currentTool?.foundedYear || ''} 
                    onChange={(e) => setCurrentTool({...currentTool, foundedYear: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userCount">User Count</Label>
                  <Input 
                    id="userCount" 
                    type="number"
                    value={currentTool?.userCount || ''} 
                    onChange={(e) => setCurrentTool({...currentTool, userCount: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reviewCount">Review Count</Label>
                  <Input 
                    id="reviewCount" 
                    type="number"
                    value={currentTool?.reviewCount || ''} 
                    onChange={(e) => setCurrentTool({...currentTool, reviewCount: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox 
                    id="featured" 
                    checked={currentTool?.featured || false}
                    onCheckedChange={(checked: boolean) => 
                      setCurrentTool({...currentTool, featured: checked})
                    }
                  />
                  <Label htmlFor="featured">Featured Tool</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUpload">Tool Image *</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label 
                        htmlFor="imageUpload"
                        className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Image Preview" 
                            className="max-h-24 object-contain mb-2" 
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        )}
                        <span className="text-sm text-gray-500">
                          {imagePreview ? "Change image" : "Upload image"}
                        </span>
                      </Label>
                      <Input 
                        id="imageUpload" 
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logoUpload">Tool Logo</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label 
                        htmlFor="logoUpload"
                        className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Logo Preview" 
                            className="max-h-24 object-contain mb-2" 
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        )}
                        <span className="text-sm text-gray-500">
                          {logoPreview ? "Change logo" : "Upload logo"}
                        </span>
                      </Label>
                      <Input 
                        id="logoUpload" 
                        type="file"
                        className="hidden"
                        onChange={handleLogoChange}
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea 
                  id="shortDescription" 
                  value={currentTool?.shortDescription || ''} 
                  onChange={(e) => setCurrentTool({...currentTool, shortDescription: e.target.value})}
                  placeholder="Brief description (1-2 sentences)"
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea 
                  id="description" 
                  value={currentTool?.description || ''} 
                  onChange={(e) => setCurrentTool({...currentTool, description: e.target.value})}
                  placeholder="Detailed description of the tool"
                  className="h-24 resize-none"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag" 
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)} 
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Use Cases</Label>
                <div className="space-y-2">
                  <Input 
                    value={newUseCase.title} 
                    onChange={(e) => setNewUseCase({...newUseCase, title: e.target.value})}
                    placeholder="Use case title" 
                  />
                  <Textarea 
                    value={newUseCase.description} 
                    onChange={(e) => setNewUseCase({...newUseCase, description: e.target.value})}
                    placeholder="Use case description"
                    className="resize-none"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddUseCase}
                    className="w-full"
                  >
                    Add Use Case
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {useCases.map((useCase, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md relative">
                      <h4 className="font-medium">{useCase.title}</h4>
                      <p className="text-sm text-gray-600">{useCase.description}</p>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => handleRemoveUseCase(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </ScrollArea>
          
          <DialogFooter className="px-6 pb-6 pt-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {isEditing ? 'Update Tool' : 'Add Tool'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSupabaseDialogOpen} onOpenChange={setIsSupabaseDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Connect to Supabase</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supabaseUrl">Supabase Project URL</Label>
              <Input 
                id="supabaseUrl" 
                value={supabaseUrl} 
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supabaseKey">Supabase Anon Key</Label>
              <Input 
                id="supabaseKey" 
                value={supabaseKey} 
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="your-anon-key"
                type="password"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">SQL Schema for Your New Database</h4>
              <ScrollArea className="h-40">
                <pre className="text-xs overflow-x-auto bg-gray-100 p-2 rounded">
{`-- Create AI Tools table
CREATE TABLE ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT NOT NULL,
  logo_url TEXT,
  pricing_model TEXT NOT NULL,
  rating NUMERIC DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  founded_year INTEGER,
  user_count INTEGER,
  review_count INTEGER DEFAULT 0,
  slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create AI Tool Tags table
CREATE TABLE ai_tool_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_tool_id UUID NOT NULL,
  tag TEXT NOT NULL
);

-- Create AI Tool Use Cases table
CREATE TABLE ai_tool_use_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_tool_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Create Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Tool Submissions table
CREATE TABLE tool_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  pricing_model TEXT NOT NULL,
  tags TEXT[],
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Contact Submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Newsletter Subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('tool_images', 'tool_images', true);

-- Create policies for storage bucket
CREATE POLICY "Public Access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tool_images');

CREATE POLICY "Authenticated users can upload" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'tool_images');

CREATE POLICY "Users can update own objects" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'tool_images' AND auth.uid() = owner);

CREATE POLICY "Users can delete own objects" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'tool_images' AND auth.uid() = owner);`}
                </pre>
              </ScrollArea>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(document.querySelector('pre')?.textContent || '');
                  toast({
                    title: "SQL copied to clipboard",
                    description: "You can now paste this SQL into your Supabase SQL Editor",
                  });
                }}
              >
                Copy SQL to Clipboard
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                if (supabaseUrl && supabaseKey) {
                  try {
                    updateSupabaseCredentials(supabaseUrl, supabaseKey);
                    // Invalidate all queries to force refetch with new client
                    queryClient.invalidateQueries();
                    toast({
                      title: "Supabase connection updated",
                      description: "Successfully connected to the new Supabase project. Data will now be fetched from the new database.",
                    });
                    setIsSupabaseDialogOpen(false);
                  } catch (error) {
                    toast({
                      title: "Connection failed",
                      description: "Failed to connect to Supabase. Please check your credentials.",
                      variant: "destructive"
                    });
                  }
                } else {
                  toast({
                    title: "Missing information",
                    description: "Please provide both the URL and API key",
                    variant: "destructive"
                  });
                }
              }}
            >
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminToolsPanel;
