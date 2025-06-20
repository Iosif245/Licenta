export type AssociationTagCategory = 'technology' | 'academic' | 'cultural' | 'sports' | 'arts' | 'business' | 'science' | 'social' | 'environmental' | 'healthcare';

export interface AssociationTag {
  name: string;
  category: AssociationTagCategory;
}

export interface AssociationTagsData {
  technology: string[];
  academic: string[];
  cultural: string[];
  sports: string[];
  arts: string[];
  business: string[];
  science: string[];
  social: string[];
  environmental: string[];
  healthcare: string[];
}

export interface TagCategoryInfo {
  key: AssociationTagCategory;
  label: string;
  description: string;
}

export const TAG_CATEGORY_INFO: Record<AssociationTagCategory, TagCategoryInfo> = {
  technology: {
    key: 'technology',
    label: 'Technology',
    description: 'Programming, software development, and tech innovation',
  },
  academic: {
    key: 'academic',
    label: 'Academic',
    description: 'Research, education, and scholarly activities',
  },
  cultural: {
    key: 'cultural',
    label: 'Cultural',
    description: 'Arts, heritage, traditions, and cultural expression',
  },
  sports: {
    key: 'sports',
    label: 'Sports',
    description: 'Athletic activities, fitness, and sports competition',
  },
  arts: {
    key: 'arts',
    label: 'Arts',
    description: 'Creative arts, design, and artistic expression',
  },
  business: {
    key: 'business',
    label: 'Business',
    description: 'Entrepreneurship, management, and business development',
  },
  science: {
    key: 'science',
    label: 'Science',
    description: 'Scientific research, experimentation, and discovery',
  },
  social: {
    key: 'social',
    label: 'Social',
    description: 'Community service, advocacy, and social impact',
  },
  environmental: {
    key: 'environmental',
    label: 'Environmental',
    description: 'Sustainability, conservation, and environmental protection',
  },
  healthcare: {
    key: 'healthcare',
    label: 'Healthcare',
    description: 'Medical research, health services, and wellness',
  },
};

// Helper functions
export function getAllAssociationTags(tagsData: AssociationTagsData): AssociationTag[] {
  const tags: AssociationTag[] = [];

  Object.entries(tagsData).forEach(([category, tagNames]) => {
    tagNames.forEach((name: string) => {
      tags.push({
        name,
        category: category as AssociationTagCategory,
      });
    });
  });

  return tags;
}

export function getTagsByCategory(tagsData: AssociationTagsData, category: AssociationTagCategory): string[] {
  return tagsData[category] || [];
}

export function getCategoryForTag(tagsData: AssociationTagsData, tagName: string): AssociationTagCategory | null {
  for (const [category, tags] of Object.entries(tagsData)) {
    if (tags.includes(tagName)) {
      return category as AssociationTagCategory;
    }
  }
  return null;
}
