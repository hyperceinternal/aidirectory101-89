import { supabase } from "@/integrations/supabase/client";
import { AIProduct } from "@/types/product";

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

  // Transform to expected format
  return tools.map((tool): AIProduct => {
    const toolTags = tagsData
      .filter(tag => tag.ai_tool_id === tool.id)
      .map(tag => tag.tag);

    return {
      id: tool.id,
      name: tool.name,
      description: tool.description,
      shortDescription: tool.short_description,
      category: tool.category,
      url: tool.url,
      image: tool.image_url,
      tags: toolTags,
      rating: tool.rating,
      featured: tool.featured,
      pricingModel: tool.pricing_model,
      reviewCount: tool.review_count || 0,
      foundedYear: tool.founded_year,
      userCount: tool.user_count,
      slug: tool.slug
    };
  });
};

export const fetchFeaturedTools = async (): Promise<AIProduct[]> => {
  const { data: tools, error } = await supabase
    .from('ai_tools')
    .select('*')
    .eq('featured', true);

  if (error) {
    console.error("Error fetching featured AI tools:", error);
    throw error;
  }

  // Fetch tags for featured tools
  const toolIds = tools.map(tool => tool.id);
  const { data: tagsData, error: tagsError } = await supabase
    .from('ai_tool_tags')
    .select('*')
    .in('ai_tool_id', toolIds);

  if (tagsError) {
    console.error("Error fetching tags:", tagsError);
    throw tagsError;
  }

  // Transform to expected format
  return tools.map((tool): AIProduct => {
    const toolTags = tagsData
      .filter(tag => tag.ai_tool_id === tool.id)
      .map(tag => tag.tag);

    return {
      id: tool.id,
      name: tool.name,
      description: tool.description,
      shortDescription: tool.short_description,
      category: tool.category,
      url: tool.url,
      image: tool.image_url,
      tags: toolTags,
      rating: tool.rating,
      featured: tool.featured,
      pricingModel: tool.pricing_model,
      reviewCount: tool.review_count || 0,
      foundedYear: tool.founded_year,
      userCount: tool.user_count,
      slug: tool.slug
    };
  });
};

export const fetchToolById = async (idOrSlug: string): Promise<AIProduct | null> => {
  // Try to fetch by slug first
  let { data: tool, error } = await supabase
    .from('ai_tools')
    .select('*')
    .eq('slug', idOrSlug)
    .single();
  
  // If not found by slug, try by ID
  if (error && error.code === 'PGRST116') {
    const { data: toolById, error: errorById } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('id', idOrSlug)
      .single();
    
    if (errorById) {
      if (errorById.code === 'PGRST116') {
        // Record not found by either slug or ID
        return null;
      }
      console.error("Error fetching AI tool by ID:", errorById);
      throw errorById;
    }
    
    tool = toolById;
  } else if (error) {
    console.error("Error fetching AI tool by slug:", error);
    throw error;
  }

  // Fetch tags for this tool
  const { data: tagsData, error: tagsError } = await supabase
    .from('ai_tool_tags')
    .select('*')
    .eq('ai_tool_id', tool.id);

  if (tagsError) {
    console.error("Error fetching tags:", tagsError);
    throw tagsError;
  }

  // Fetch use cases for this tool
  const { data: useCasesData, error: useCasesError } = await supabase
    .from('ai_tool_use_cases')
    .select('*')
    .eq('ai_tool_id', tool.id);

  if (useCasesError) {
    console.error("Error fetching use cases:", useCasesError);
    throw useCasesError;
  }

  // Transform to expected format
  return {
    id: tool.id,
    name: tool.name,
    description: tool.description,
    shortDescription: tool.short_description,
    category: tool.category,
    url: tool.url,
    image: tool.image_url,
    tags: tagsData.map(tag => tag.tag),
    rating: tool.rating,
    featured: tool.featured,
    pricingModel: tool.pricing_model,
    reviewCount: tool.review_count || 0,
    foundedYear: tool.founded_year,
    userCount: tool.user_count,
    slug: tool.slug,
    useCases: useCasesData.map(useCase => ({
      title: useCase.title,
      description: useCase.description
    }))
  };
};

export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('ai_tools')
    .select('category');

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  // Extract unique categories
  const categories = [...new Set(data.map(item => item.category))];
  return categories;
};

export const getTags = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('ai_tool_tags')
    .select('tag');

  if (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }

  // Extract unique tags
  const tags = [...new Set(data.map(item => item.tag))];
  return tags;
};

export const filterProducts = async (category: string = "", searchTerm: string = ""): Promise<AIProduct[]> => {
  let query = supabase.from('ai_tools').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }
  
  const { data: tools, error } = await query;

  if (error) {
    console.error("Error filtering AI tools:", error);
    throw error;
  }
  
  // If no tools match, return empty array
  if (!tools || tools.length === 0) {
    return [];
  }

  // Fetch tags for these tools
  const toolIds = tools.map(tool => tool.id);
  const { data: tagsData, error: tagsError } = await supabase
    .from('ai_tool_tags')
    .select('*')
    .in('ai_tool_id', toolIds);

  if (tagsError) {
    console.error("Error fetching tags:", tagsError);
    throw tagsError;
  }

  // If search is by tag, we need to filter tools that have the tag
  if (searchTerm && tagsData) {
    const tagMatches = tagsData.filter(t => 
      t.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const tagMatchToolIds = [...new Set(tagMatches.map(t => t.ai_tool_id))];
    
    // Add tools that match tag search but weren't caught by name/description search
    if (tagMatchToolIds.length > 0) {
      const missingToolIds = tagMatchToolIds.filter(id => 
        !tools.some(tool => tool.id === id)
      );
      
      if (missingToolIds.length > 0) {
        const { data: additionalTools, error: additionalError } = await supabase
          .from('ai_tools')
          .select('*')
          .in('id', missingToolIds);
          
        if (!additionalError && additionalTools) {
          tools.push(...additionalTools);
        }
      }
    }
  }

  // Transform to expected format
  return tools.map((tool): AIProduct => {
    const toolTags = tagsData
      ? tagsData.filter(tag => tag.ai_tool_id === tool.id).map(tag => tag.tag)
      : [];

    return {
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      url: tool.url,
      image: tool.image_url,
      tags: toolTags,
      rating: tool.rating,
      featured: tool.featured,
      pricingModel: tool.pricing_model,
      reviewCount: tool.review_count || 0,
      foundedYear: tool.founded_year,
      userCount: tool.user_count
    };
  });
};

export const fetchRecentlyAddedTools = async (limit: number = 3): Promise<AIProduct[]> => {
  const { data: tools, error } = await supabase
    .from('ai_tools')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recently added tools:", error);
    throw error;
  }

  // If no tools match, return empty array
  if (!tools || tools.length === 0) {
    return [];
  }

  // Fetch tags for these tools
  const toolIds = tools.map(tool => tool.id);
  const { data: tagsData, error: tagsError } = await supabase
    .from('ai_tool_tags')
    .select('*')
    .in('ai_tool_id', toolIds);

  if (tagsError) {
    console.error("Error fetching tags:", tagsError);
    throw tagsError;
  }

  // Transform to expected format
  return tools.map((tool): AIProduct => {
    const toolTags = tagsData
      ? tagsData.filter(tag => tag.ai_tool_id === tool.id).map(tag => tag.tag)
      : [];

    return {
      id: tool.id,
      name: tool.name,
      description: tool.description,
      shortDescription: tool.short_description,
      category: tool.category,
      url: tool.url,
      image: tool.image_url,
      tags: toolTags,
      rating: tool.rating,
      featured: tool.featured,
      pricingModel: tool.pricing_model,
      reviewCount: tool.review_count || 0,
      foundedYear: tool.founded_year,
      userCount: tool.user_count,
      slug: tool.slug
    };
  });
};

export const fetchToolBySlug = async (slug: string): Promise<AIProduct | null> => {
  const { data: tool, error } = await supabase
    .from('ai_tools')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Record not found
      return null;
    }
    console.error("Error fetching AI tool by slug:", error);
    throw error;
  }

  // Fetch tags for this tool
  const { data: tagsData, error: tagsError } = await supabase
    .from('ai_tool_tags')
    .select('*')
    .eq('ai_tool_id', tool.id);

  if (tagsError) {
    console.error("Error fetching tags:", tagsError);
    throw tagsError;
  }

  // Fetch use cases for this tool
  const { data: useCasesData, error: useCasesError } = await supabase
    .from('ai_tool_use_cases')
    .select('*')
    .eq('ai_tool_id', tool.id);

  if (useCasesError) {
    console.error("Error fetching use cases:", useCasesError);
    throw useCasesError;
  }

  // Transform to expected format
  return {
    id: tool.id,
    name: tool.name,
    description: tool.description,
    shortDescription: tool.short_description,
    category: tool.category,
    url: tool.url,
    image: tool.image_url,
    tags: tagsData.map(tag => tag.tag),
    rating: tool.rating,
    featured: tool.featured,
    pricingModel: tool.pricing_model,
    reviewCount: tool.review_count || 0,
    foundedYear: tool.founded_year,
    userCount: tool.user_count,
    slug: tool.slug,
    useCases: useCasesData.map(useCase => ({
      title: useCase.title,
      description: useCase.description
    }))
  };
};
