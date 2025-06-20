import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Search, Calendar, ChevronDown, Filter } from 'lucide-react';
import React from 'react';

interface SearchFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onFilter: () => void;
}

const SearchFilterBar = ({ searchTerm, setSearchTerm, selectedDate, setSelectedDate, onFilter }: SearchFilterBarProps) => {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card p-6 rounded-xl shadow-md -mt-12 relative z-10 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input type="text" placeholder="Search for events..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-6" />
            </div>
            <div className="relative">
              <select
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="h-full appearance-none pl-10 pr-10 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
              </select>
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button className="gap-2" onClick={onFilter}>
              <Filter className="h-5 w-5" />
              Filter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFilterBar;
