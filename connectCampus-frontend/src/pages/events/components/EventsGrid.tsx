import React from 'react';
import { Button } from '@app/components/ui/button';
import { BookOpen, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from '@app/pages/events/components/EventCard';
import { EventSummary } from '@app/types/event';

interface EventsGridProps {
  events: EventSummary[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  viewMode?: 'grid' | 'list';
}

const EventsGrid: React.FC<EventsGridProps> = ({ events, isLoading, currentPage, totalPages, onPageChange, viewMode = 'grid' }) => {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`bg-card/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-border/40 animate-pulse ${viewMode === 'list' ? 'flex gap-4 p-4' : ''}`}
            >
              {/* Cover image skeleton */}
              <div className={viewMode === 'list' ? 'w-48 h-32 bg-gray-200 dark:bg-gray-800 rounded-xl flex-shrink-0' : 'h-48 bg-gray-200 dark:bg-gray-800'} />

              {/* Content skeleton */}
              <div className={`space-y-3 ${viewMode === 'list' ? 'flex-1 py-2' : 'p-4'}`}>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />

                {/* Stats skeleton */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                </div>

                {/* Tags skeleton */}
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-16" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-14" />
                </div>

                {/* Button skeleton */}
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (events.length === 0) {
    return (
      <div className="text-center py-16 bg-card/50 rounded-3xl border border-border/50">
        <div className="max-w-md mx-auto space-y-6">
          <div
            className="w-24 h-24 mx-auto bg-gradient-to-tr from-primary/20 to-secondary/20 
            rounded-full flex items-center justify-center"
          >
            <BookOpen className="h-12 w-12 text-primary" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria to find what you're looking for.</p>
          </div>

          <Button variant="outline" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
            <RefreshCw className="h-4 w-4" />
            Refresh Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Events grid/list */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
        {events.map((event, index) => (
          <div
            key={event.id}
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both',
            }}
          >
            <EventCard event={event} viewMode={viewMode} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-10 w-10 border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => onPageChange(pageNum)}
                  className={`h-10 w-10 transition-all duration-300 ${
                    currentPage === pageNum ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary'
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-10 w-10 border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Load more section (if needed for infinite scroll) */}
      {events.length > 0 && events.length % 12 === 0 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg" className="px-8 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
            Load More Events
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventsGrid;
