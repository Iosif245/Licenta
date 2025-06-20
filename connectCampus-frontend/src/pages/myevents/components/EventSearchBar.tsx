import { Input } from '@app/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

interface EventSearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventSearchBar = ({ searchTerm, onSearchChange }: EventSearchBarProps) => {
  return (
    <div className="relative w-full sm:w-auto">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
      <Input type="text" placeholder="Search events..." value={searchTerm} onChange={onSearchChange} className="pl-8 w-full sm:w-[250px] border-border h-8 text-sm" />
    </div>
  );
};

export default EventSearchBar;
