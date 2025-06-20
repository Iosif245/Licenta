import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { Input } from '@app/components/ui/input';
import { Search } from 'lucide-react';

interface FilterSearchBarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const FilterSearchBar = ({ activeTab, onTabChange, searchTerm, onSearchChange }: FilterSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full sm:w-auto">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="text" placeholder="Search favorites..." value={searchTerm} onChange={e => onSearchChange(e.target.value)} className="pl-9 w-full sm:w-[250px] border-border" />
      </div>
    </div>
  );
};

export default FilterSearchBar;
