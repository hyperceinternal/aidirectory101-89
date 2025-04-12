
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  InfoIcon, 
  Link2Icon, 
  ImageIcon, 
  TagIcon, A,
  PlusCircle,
  X,
  Send
} from 'lucide-react';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  name: z.string().min(2, { message: "Tool name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  url: z.string().url({ message: "Please enter a valid URL" }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }).optional(),
  tags: z.array(z.string()).optional(),
  pricingModel: z.string().min(1, { message: "Please select a pricing model" }),
  termsAgreed: z.boolean().refine(val => val === true, { message: "You must agree to the terms" })
});

type FormValues = z.infer<typeof formSchema>;

interface SubmitToolFormProps {
  onSubmitSuccess: () => void;
}

const SubmitToolForm: React.FC<SubmitToolFormProps> = ({ onSubmitSuccess }) => {
  const [tagInput, setTagInput] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      url: '',
      imageUrl: '',
      tags: [],
      pricingModel: '',
      termsAgreed: false,
    },
  });

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

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    
    // In a real application, you would send this data to your backend
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      onSubmitSuccess();
    }, 1000);
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
                        <SelectItem value="chatbot">AI Chatbot</SelectItem>
                        <SelectItem value="image-generation">Image Generation</SelectItem>
                        <SelectItem value="text-generation">Text Generation</SelectItem>
                        <SelectItem value="audio-generation">Audio Generation</SelectItem>
                        <SelectItem value="video-generation">Video Generation</SelectItem>
                        <SelectItem value="code-assistant">Code Assistant</SelectItem>
                        <SelectItem value="research">Research Tool</SelectItem>
                        <SelectItem value="data-analysis">Data Analysis</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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

            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo/Image URL</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4 text-gray-400" />
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    URL to the tool's logo or a screenshot (optional)
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
              <Button type="submit" className="px-6">
                <Send className="mr-2 h-4 w-4" />
                Submit Tool
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SubmitToolForm;
