export type InterestCategory = 'technology' | 'design' | 'business' | 'creative' | 'personal_development' | 'academic' | 'writing' | 'health_fitness' | 'lifestyle';

export interface Interest {
  name: string;
  category: InterestCategory;
}

export interface InterestsData {
  technology: string[];
  design: string[];
  business: string[];
  creative: string[];
  personal_development: string[];
  academic: string[];
  writing: string[];
  health_fitness: string[];
  lifestyle: string[];
}

export interface CategoryInfo {
  key: InterestCategory;
  label: string;
  description: string;
}

export const CATEGORY_INFO: Record<InterestCategory, CategoryInfo> = {
  technology: {
    key: 'technology',
    label: 'Technology',
    description: 'Programming, software development, and tech trends',
  },
  design: {
    key: 'design',
    label: 'Design',
    description: 'Visual design, user experience, and creative tools',
  },
  business: {
    key: 'business',
    label: 'Business',
    description: 'Entrepreneurship, management, and business strategy',
  },
  creative: {
    key: 'creative',
    label: 'Creative',
    description: 'Content creation, media production, and artistic expression',
  },
  personal_development: {
    key: 'personal_development',
    label: 'Personal Development',
    description: 'Self-improvement, skills building, and career growth',
  },
  academic: {
    key: 'academic',
    label: 'Academic',
    description: 'Research, academic writing, and scholarly activities',
  },
  writing: {
    key: 'writing',
    label: 'Writing',
    description: 'Content writing, journalism, and communication',
  },
  health_fitness: {
    key: 'health_fitness',
    label: 'Health & Fitness',
    description: 'Physical wellness, mental health, and lifestyle',
  },
  lifestyle: {
    key: 'lifestyle',
    label: 'Lifestyle',
    description: 'Hobbies, travel, and personal interests',
  },
};

// Helper functions
export function getAllInterests(interestsData: InterestsData): Interest[] {
  const interests: Interest[] = [];

  Object.entries(interestsData).forEach(([category, interestNames]) => {
    interestNames.forEach((name: string) => {
      interests.push({
        name,
        category: category as InterestCategory,
      });
    });
  });

  return interests;
}

export function getInterestsByCategory(interestsData: InterestsData, category: InterestCategory): string[] {
  return interestsData[category] || [];
}

export function getCategoryForInterest(interestsData: InterestsData, interestName: string): InterestCategory | null {
  for (const [category, interests] of Object.entries(interestsData)) {
    if (interests.includes(interestName)) {
      return category as InterestCategory;
    }
  }
  return null;
}
