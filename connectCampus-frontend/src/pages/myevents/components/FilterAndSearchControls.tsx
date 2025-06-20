import React from 'react';
import EventTabsFilter from './EventTabsFilter';
import EventSearchBar from './EventSearchBar';

interface FilterAndSearchControlsProps {
  activeTab: string;
  searchTerm: string;
  onTabChange: (value: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterAndSearchControls = ({ activeTab, searchTerm, onTabChange, onSearchChange }: FilterAndSearchControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <EventTabsFilter activeTab={activeTab} onTabChange={onTabChange} />
      <EventSearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
    </div>
  );
};

export default FilterAndSearchControls;
