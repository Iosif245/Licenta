import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Search, Users, ChevronDown, Filter } from 'lucide-react';
import React from 'react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchAndFilter = ({ searchTerm, onSearchChange }: SearchAndFilterProps) => {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card p-6 rounded-xl shadow-md -mt-12 relative z-10 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input type="text" placeholder="Search for associations..." value={searchTerm} onChange={onSearchChange} className="w-full pl-10 pr-4 py-6" />
            </div>
            <div className="relative">
              <select
                className="h-full appearance-none pl-10 pr-10 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Sort associations"
              >
                <option value="">Sort By</option>
                <option value="members">Most Members</option>
                <option value="events">Most Events</option>
                <option value="newest">Newest</option>
              </select>
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button className="gap-2">
              <Filter className="h-5 w-5" />
              Filter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchAndFilter;
