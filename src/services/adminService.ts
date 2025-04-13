
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
  // First, insert the tool
  const { data, error } = await supabase
    .from('ai_tools')
    .insert({
      name: tool.name,
      description: tool.description,
      short_description: tool.shortDescription,
      category: tool.category,
      url: tool.url,
      image_url: tool.image,
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

  // Handle tags
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

  // Handle use cases
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
    id: newToolId
  };
};

// Update an existing tool
export const updateTool = async (tool: AIProduct): Promise<AIProduct> => {
  // Update the tool
  const { error } = await supabase
    .from('ai_tools')
    .update({
      name: tool.name,
      description: tool.description,
      short_description: tool.shortDescription,
      category: tool.category,
      url: tool.url,
      image_url: tool.image,
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

  // Delete existing tags and insert new ones
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

  // Delete existing use cases and insert new ones
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

  return tool;
};

// Delete a tool
export const deleteTool = async (id: string): Promise<void> => {
  // Delete associated tags first
  const { error: deleteTagsError } = await supabase
    .from('ai_tool_tags')
    .delete()
    .eq('ai_tool_id', id);

  if (deleteTagsError) {
    console.error("Error deleting tags:", deleteTagsError);
    throw deleteTagsError;
  }

  // Delete associated use cases
  const { error: deleteUseCasesError } = await supabase
    .from('ai_tool_use_cases')
    .delete()
    .eq('ai_tool_id', id);

  if (deleteUseCasesError) {
    console.error("Error deleting use cases:", deleteUseCasesError);
    throw deleteUseCasesError;
  }

  // Delete the tool
  const { error } = await supabase
    .from('ai_tools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting tool:", error);
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
