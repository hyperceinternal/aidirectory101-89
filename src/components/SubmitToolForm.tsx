
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  InfoIcon, 
  Link2Icon, 
  ImageIcon, 
  TagIcon,
  PlusCircle,
  X,
  Send,
  Mail,
  Upload
} from 'lucide-react';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchCategories } from '@/services/adminService';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const formSchema = z.object({
  name: z.string().min(2, { message: "Tool name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  url: z.string().url({ message: "Please enter a valid URL" }),
  tags: z.array(z.string()).optional(),
  pricingModel: z.string().min(1, { message: "Please select a pricing model" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  termsAgreed: z.boolean().refine(val => val === true, { message: "You must agree to the terms" })
});

type FormValues = z.infer<typeof formSchema>;

interface SubmitToolFormProps {
  onSubmitSuccess: () => void;
}

const SubmitToolForm: React.FC<SubmitToolFormProps> = ({ onSubmitSuccess }) => {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch categories from the database
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      url: '',
      tags: [],
      pricingModel: '',
      email: '',
      termsAgreed: false,
    },
  });

  // Handle image upload - fixed to trigger file dialog
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);
      
      // Upload image to Supabase Storage if provided
      let imageUrl = '';
      if (imageFile) {
        const filename = `${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('tool_images')
          .upload(filename, imageFile);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw uploadError;
        }

        // Get public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from('tool_images')
          .getPublicUrl(filename);
          
        imageUrl = urlData.publicUrl;
      }
      
      // Generate a slug from the tool name
      const slug = data.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-');      // Replace multiple hyphens with single hyphen
      
      // Insert tool submission into the database
      const { error } = await supabase
        .from('tool_submissions')
        .insert({
          name: data.name,
          description: data.description,
          short_description: data.description.substring(0, 150) + (data.description.length > 150 ? '...' : ''),
          category: data.category,
          url: data.url,
          image_url: imageUrl,
          pricing_model: data.pricingModel,
          tags: data.tags,
          email: data.email,
          status: 'pending'
        });

      if (error) {
        throw error;
      }
      
      setIsUploading(false);
      onSubmitSuccess();
    } catch (error) {
      setIsUploading(false);
      console.error('Error submitting tool:', error);
      // Handle error (could show a toast here)
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tool Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tool Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <InfoIcon className="h-4 w-4 text-gray-400" />
                        <Input placeholder="e.g., ChatGPT, Midjourney" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      The name of the AI tool you're submitting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tool URL */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Link2Icon className="h-4 w-4 text-gray-400" />
                        <Input placeholder="https://example.com" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      The official website of the tool
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tool Image - Fixed to be clickable */}
            <div className="space-y-2">
              <FormLabel htmlFor="imageUpload">Tool Image</FormLabel>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={triggerFileInput}
              >
                {imagePreview ? (
                  <div className="text-center">
                    <img 
                      src={imagePreview} 
                      alt="Image Preview" 
                      className="max-h-36 mx-auto object-contain mb-4" 
                    />
                    <p className="text-sm text-gray-500">Click to change image</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Upload a screenshot or logo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, or GIF (max 5MB)</p>
                  </div>
                )}
                <Input 
                  id="imageUpload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </div>
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what the tool does, its features, and benefits..." 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a comprehensive description of the tool
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="loading">Loading categories...</SelectItem>
                        ) : (
                          categories?.map((category, index) => (
                            <SelectItem key={index} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the most appropriate category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pricing Model */}
              <FormField
                control={form.control}
                name="pricingModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="freemium">Freemium</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="one-time">One-time Purchase</SelectItem>
                        <SelectItem value="usage-based">Usage-based</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How is the tool priced?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <Input placeholder="your.email@example.com" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your email address (optional, for follow-up questions)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex items-center space-x-2">
                    <TagIcon className="h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Add tags and press Enter" 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addTag}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md flex items-center text-sm"
                      >
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Add relevant tags to help users find this tool (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms Agreement */}
            <FormField
              control={form.control}
              name="termsAgreed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Terms and Conditions
                    </FormLabel>
                    <FormDescription>
                      I confirm that I have the right to submit this tool and that all information provided is accurate.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" className="px-6" disabled={isUploading}>
                {isUploading ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Tool
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SubmitToolForm;
