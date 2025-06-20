import { Tabs, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import React from 'react';

interface EventTabsFilterProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const EventTabsFilter = ({ activeTab, onTabChange }: EventTabsFilterProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full sm:w-auto">
      <TabsList className="h-8">
        <TabsTrigger value="all" className="flex items-center gap-1 h-6 px-3 text-xs">
          <Calendar className="h-3 w-3" />
          <span>All</span>
        </TabsTrigger>
        <TabsTrigger value="upcoming" className="flex items-center gap-1 h-6 px-3 text-xs">
          <Clock className="h-3 w-3" />
          <span>Upcoming</span>
        </TabsTrigger>
        <TabsTrigger value="past" className="flex items-center gap-1 h-6 px-3 text-xs">
          <ArrowRight className="h-3 w-3" />
          <span>Past</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default EventTabsFilter;
