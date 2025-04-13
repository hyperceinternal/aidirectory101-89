
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
  DialogTrigger
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
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  
  // Fetch all tools
  const { data: tools, isLoading } = useQuery({
    queryKey: ['admin', 'tools'],
    queryFn: fetchAllTools
  });
  
  // Fetch categories for dropdown
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: fetchCategories
  });
  
  // Create tool mutation
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
  
  // Update tool mutation
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
  
  // Delete tool mutation
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
  
  // Reset form
  const resetForm = () => {
    setCurrentTool(null);
    setIsEditing(false);
    setIsAddDialogOpen(false);
    setTags([]);
    setUseCases([]);
    setNewCategory('');
    setIsNewCategory(false);
  };
  
  // Edit tool
  const handleEditTool = (tool: AIProduct) => {
    setCurrentTool(tool);
    setTags(tool.tags || []);
    setUseCases(tool.useCases || []);
    setIsEditing(true);
    setIsAddDialogOpen(true);
  };
  
  // Add new tool
  const handleAddNewTool = () => {
    setCurrentTool({
      name: '',
      description: '',
      shortDescription: '',
      category: '',
      url: '',
      image: '',
      tags: [],
      rating: 0,
      pricingModel: 'Free',
      featured: false
    });
    setTags([]);
    setUseCases([]);
    setIsEditing(false);
    setIsAddDialogOpen(true);
  };
  
  // Handle form submit
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
    
    // Set category based on selection
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
        useCases
      } as AIProduct;
      
      if (isEditing && currentTool.id) {
        await updateToolMutation.mutateAsync(toolData);
      } else {
        await createToolMutation.mutateAsync(toolData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      setIsNewCategory(true);
      setCurrentTool({...currentTool, category: ''});
    } else {
      setIsNewCategory(false);
      setCurrentTool({...currentTool, category: value});
    }
  };
  
  // Handle tag input
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };
  
  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle use case
  const handleAddUseCase = () => {
    if (newUseCase.title && newUseCase.description) {
      setUseCases([...useCases, newUseCase as UseCase]);
      setNewUseCase({ title: '', description: '' });
    }
  };
  
  // Remove use case
  const handleRemoveUseCase = (index: number) => {
    setUseCases(useCases.filter((_, i) => i !== index));
  };
  
  // Handle delete
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
      <div className="flex justify-end mb-4">
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Tool' : 'Add New Tool'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="image">Image URL *</Label>
                <Input 
                  id="image" 
                  type="url"
                  value={currentTool?.image || ''} 
                  onChange={(e) => setCurrentTool({...currentTool, image: e.target.value})}
                  required
                />
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
                <Label htmlFor="slug">Slug (URL friendly name)</Label>
                <Input 
                  id="slug" 
                  value={currentTool?.slug || ''} 
                  onChange={(e) => setCurrentTool({...currentTool, slug: e.target.value})}
                  placeholder="e.g. tool-name"
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
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Tool' : 'Add Tool'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminToolsPanel;
