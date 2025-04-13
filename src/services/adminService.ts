import { supabase } from "@/integrations/supabase/client";
import { AIProduct, UseCase } from "@/types/product";

// Fetch all tools for admin
export const fetchAllTools = async (): Promise<AIProduct[]> => {
  const { data: tools, error } = await supabase
    .from('ai_tools')
    .select('*');

  if (error) {
    console.error("Error fetching AI tools:", error);
    throw error;
  }

  // Fetch tags for all tools
  const { data: tagsData, error: tagsError } = await supabase
    .from('ai_tool_tags')
    .select('*');

  if (tagsError) {
    console.error("Error fetching tags:", tagsError);
    throw tagsError;
  }

  // Fetch use cases for all tools
  const { data: useCasesData, error: useCasesError } = await supabase
    .from('ai_tool_use_cases')
    .select('*');

  if (useCasesError) {
    console.error("Error fetching use cases:", useCasesError);
    throw useCasesError;
  }

  // Transform to expected format
  return tools.map((tool): AIProduct => {
    const toolTags = tagsData
      .filter(tag => tag.ai_tool_id === tool.id)
      .map(tag => tag.tag);

    const toolUseCases = useCasesData
      .filter(useCase => useCase.ai_tool_id === tool.id)
      .map(useCase => ({
        title: useCase.title,
        description: useCase.description
      }));

    return {
      id: tool.id,
      name: tool.name,
      description: tool.description,
      shortDescription: tool.short_description,
      category: tool.category,
      url: tool.url,
      image: tool.image_url,
      logoUrl: tool.logo_url,
      tags: toolTags,
      rating: tool.rating || 0,
      featured: tool.featured || false,
      pricingModel: tool.pricing_model,
      reviewCount: tool.review_count || 0,
      foundedYear: tool.founded_year,
      userCount: tool.user_count,
      slug: tool.slug,
      useCases: toolUseCases
    };
  });
};

// Create a new tool
export const createTool = async (tool: AIProduct): Promise<AIProduct> => {
  // Upload image to storage if provided as File
  let imageUrl = tool.image;
  
  if (tool.imageFile && typeof tool.imageFile !== 'string') {
    const filename = `${Date.now()}-${tool.imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tool_images')
      .upload(filename, tool.imageFile);

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
  
  // Upload logo to storage if provided as File
  let logoUrl = tool.logoUrl;
  
  if (tool.logoFile && typeof tool.logoFile !== 'string') {
    const filename = `logo-${Date.now()}-${tool.logoFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tool_images')
      .upload(filename, tool.logoFile);

    if (uploadError) {
      console.error("Error uploading logo:", uploadError);
      throw uploadError;
    }

    // Get public URL for the uploaded logo
    const { data: urlData } = supabase.storage
      .from('tool_images')
      .getPublicUrl(filename);
      
    logoUrl = urlData.publicUrl;
  }

  const { data, error } = await supabase
    .from('ai_tools')
    .insert({
      name: tool.name,
      description: tool.description,
      short_description: tool.shortDescription,
      category: tool.category,
      url: tool.url,
      image_url: imageUrl,
      logo_url: logoUrl,
      rating: tool.rating || 0,
      featured: tool.featured || false,
      pricing_model: tool.pricingModel,
      review_count: tool.reviewCount || 0,
      founded_year: tool.foundedYear,
      user_count: tool.userCount,
      slug: tool.slug || generateSlug(tool.name)
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating tool:", error);
    throw error;
  }

  const newToolId = data.id;

  if (tool.tags && tool.tags.length > 0) {
    const tagInserts = tool.tags.map(tag => ({
      ai_tool_id: newToolId,
      tag: tag
    }));

    const { error: tagError } = await supabase
      .from('ai_tool_tags')
      .insert(tagInserts);

    if (tagError) {
      console.error("Error adding tags:", tagError);
      throw tagError;
    }
  }

  if (tool.useCases && tool.useCases.length > 0) {
    const useCaseInserts = tool.useCases.map(useCase => ({
      ai_tool_id: newToolId,
      title: useCase.title,
      description: useCase.description
    }));

    const { error: useCaseError } = await supabase
      .from('ai_tool_use_cases')
      .insert(useCaseInserts);

    if (useCaseError) {
      console.error("Error adding use cases:", useCaseError);
      throw useCaseError;
    }
  }

  return {
    ...tool,
    id: newToolId,
    image: imageUrl,
    logoUrl: logoUrl
  };
};

// Update an existing tool
export const updateTool = async (tool: AIProduct): Promise<AIProduct> => {
  // Upload image to storage if provided as File
  let imageUrl = tool.image;
  
  if (tool.imageFile && typeof tool.imageFile !== 'string') {
    const filename = `${Date.now()}-${tool.imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tool_images')
      .upload(filename, tool.imageFile);

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
  
  // Upload logo to storage if provided as File
  let logoUrl = tool.logoUrl;
  
  if (tool.logoFile && typeof tool.logoFile !== 'string') {
    const filename = `logo-${Date.now()}-${tool.logoFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tool_images')
      .upload(filename, tool.logoFile);

    if (uploadError) {
      console.error("Error uploading logo:", uploadError);
      throw uploadError;
    }

    // Get public URL for the uploaded logo
    const { data: urlData } = supabase.storage
      .from('tool_images')
      .getPublicUrl(filename);
      
    logoUrl = urlData.publicUrl;
  }

  const { error } = await supabase
    .from('ai_tools')
    .update({
      name: tool.name,
      description: tool.description,
      short_description: tool.shortDescription,
      category: tool.category,
      url: tool.url,
      image_url: imageUrl,
      logo_url: logoUrl,
      rating: tool.rating,
      featured: tool.featured,
      pricing_model: tool.pricingModel,
      review_count: tool.reviewCount,
      founded_year: tool.foundedYear,
      user_count: tool.userCount,
      slug: tool.slug || generateSlug(tool.name)
    })
    .eq('id', tool.id);

  if (error) {
    console.error("Error updating tool:", error);
    throw error;
  }

  const { error: deleteTagsError } = await supabase
    .from('ai_tool_tags')
    .delete()
    .eq('ai_tool_id', tool.id);

  if (deleteTagsError) {
    console.error("Error deleting tags:", deleteTagsError);
    throw deleteTagsError;
  }

  if (tool.tags && tool.tags.length > 0) {
    const tagInserts = tool.tags.map(tag => ({
      ai_tool_id: tool.id,
      tag: tag
    }));

    const { error: tagError } = await supabase
      .from('ai_tool_tags')
      .insert(tagInserts);

    if (tagError) {
      console.error("Error adding tags:", tagError);
      throw tagError;
    }
  }

  const { error: deleteUseCasesError } = await supabase
    .from('ai_tool_use_cases')
    .delete()
    .eq('ai_tool_id', tool.id);

  if (deleteUseCasesError) {
    console.error("Error deleting use cases:", deleteUseCasesError);
    throw deleteUseCasesError;
  }

  if (tool.useCases && tool.useCases.length > 0) {
    const useCaseInserts = tool.useCases.map(useCase => ({
      ai_tool_id: tool.id,
      title: useCase.title,
      description: useCase.description
    }));

    const { error: useCaseError } = await supabase
      .from('ai_tool_use_cases')
      .insert(useCaseInserts);

    if (useCaseError) {
      console.error("Error adding use cases:", useCaseError);
      throw useCaseError;
    }
  }

  return {
    ...tool,
    image: imageUrl,
    logoUrl: logoUrl
  };
};

// Delete a tool
export const deleteTool = async (id: string): Promise<void> => {
  const { error: deleteTagsError } = await supabase
    .from('ai_tool_tags')
    .delete()
    .eq('ai_tool_id', id);

  if (deleteTagsError) {
    console.error("Error deleting tags:", deleteTagsError);
    throw deleteTagsError;
  }

  const { error: deleteUseCasesError } = await supabase
    .from('ai_tool_use_cases')
    .delete()
    .eq('ai_tool_id', id);

  if (deleteUseCasesError) {
    console.error("Error deleting use cases:", deleteUseCasesError);
    throw deleteUseCasesError;
  }

  const { error } = await supabase
    .from('ai_tools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting tool:", error);
    throw error;
  }
};

// Fetch all categories for dropdown
export const fetchCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .order('name');

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  const categories = data.map(item => item.name);
  return categories;
};

// Create a new category
export const createCategory = async (name: string): Promise<string> => {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw error;
  }

  return data.name;
};

// Update a category
export const updateCategory = async (oldName: string, newName: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .update({ name: newName })
    .eq('name', oldName);

  if (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (name: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('name', name);

  if (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Create a tag
export const createTag = async (toolId: string, tag: string): Promise<void> => {
  const { error } = await supabase
    .from('ai_tool_tags')
    .insert({
      ai_tool_id: toolId,
      tag: tag
    });

  if (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
};

// Create a use case
export const createUseCase = async (toolId: string, useCase: UseCase): Promise<void> => {
  const { error } = await supabase
    .from('ai_tool_use_cases')
    .insert({
      ai_tool_id: toolId,
      title: useCase.title,
      description: useCase.description
    });

  if (error) {
    console.error("Error creating use case:", error);
    throw error;
  }
};

// Fetch all newsletter subscribers
export const fetchSubscribers = async () => {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching subscribers:", error);
    throw error;
  }

  return data;
};

// Delete a subscriber
export const deleteSubscriber = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting subscriber:", error);
    throw error;
  }
};

// Helper function to generate a slug from a name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Replace multiple hyphens with single hyphen
};

// TOOL SUBMISSIONS

// Fetch all tool submissions
export const fetchToolSubmissions = async () => {
  const { data, error } = await supabase
    .from('tool_submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error("Error fetching tool submissions:", error);
    throw error;
  }

  return data;
};

// Update tool submission status
export const updateToolSubmissionStatus = async (id: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('tool_submissions')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error("Error updating tool submission status:", error);
    throw error;
  }
};

// Delete tool submission
export const deleteToolSubmission = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tool_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting tool submission:", error);
    throw error;
  }
};

// Convert tool submission to AI product
export const convertSubmissionToTool = async (submission: any): Promise<void> => {
  const { data, error } = await supabase
    .from('ai_tools')
    .insert({
      name: submission.name,
      description: submission.description,
      short_description: submission.short_description,
      category: submission.category,
      url: submission.url,
      image_url: submission.image_url,
      pricing_model: submission.pricing_model,
      slug: generateSlug(submission.name)
    })
    .select()
    .single();

  if (error) {
    console.error("Error converting submission to tool:", error);
    throw error;
  }

  if (submission.tags && submission.tags.length > 0) {
    const tagInserts = submission.tags.map((tag: string) => ({
      ai_tool_id: data.id,
      tag: tag
    }));

    const { error: tagError } = await supabase
      .from('ai_tool_tags')
      .insert(tagInserts);

    if (tagError) {
      console.error("Error adding tags:", tagError);
      throw tagError;
    }
  }

  await updateToolSubmissionStatus(submission.id, 'approved');
};

// CONTACT SUBMISSIONS

// Fetch all contact submissions
export const fetchContactSubmissions = async () => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error("Error fetching contact submissions:", error);
    throw error;
  }

  return data;
};

// Update contact submission status
export const updateContactStatus = async (id: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error("Error updating contact status:", error);
    throw error;
  }
};

// Delete contact submission
export const deleteContactSubmission = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting contact submission:", error);
    throw error;
  }
};
