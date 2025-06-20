import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { Input } from '@app/components/ui/input';
import { Search } from 'lucide-react';

interface CategoryFiltersProps {
  categories: string[];
  activeFilter: string;
  onFilterChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const CategoryFilters = ({ categories, activeFilter, onFilterChange, searchTerm, onSearchChange }: CategoryFiltersProps) => {
  // All available categories (from create association form)
  const allCategories = ['Academic', 'Cultural', 'Sports', 'Technology', 'Arts', 'Business', 'Science', 'Social', 'Environmental', 'Healthcare', 'Other'];

  // Use all categories instead of just the ones from existing associations
  const availableCategories = allCategories;

  return (
    <section className="py-2">
      <div className="container mx-auto px-3 md:px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Filter by category:</span>
            <Select value={activeFilter} onValueChange={onFilterChange}>
              <SelectTrigger className="w-48 h-8 text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">
                  All Associations
                </SelectItem>
                {availableCategories.map(category => (
                  <SelectItem key={category} value={category} className="text-sm">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-auto sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
              <Input
                placeholder="Search associations, categories..."
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="pl-8 h-8 text-sm bg-card/80 backdrop-blur-sm border-border/40 focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilters;
