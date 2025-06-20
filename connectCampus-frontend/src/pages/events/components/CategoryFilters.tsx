import React from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryFiltersProps {
  categories: Category[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const CategoryFilters = ({ categories, activeFilter, setActiveFilter }: CategoryFiltersProps) => {
  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === category.id.toLowerCase() ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveFilter(category.id.toLowerCase())}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryFilters;
