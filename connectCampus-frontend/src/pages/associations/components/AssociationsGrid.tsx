import React from 'react';
import { Button } from '@app/components/ui/button';
import { BookOpen, RefreshCw } from 'lucide-react';
import AssociationCard from './AssociationCard';
import { IAssociationSummaryResponse } from '@app/types/association/IAssociationResponse';

interface AssociationsGridProps {
  associations: IAssociationSummaryResponse[];
  isLoading: boolean;
  searchTerm: string;
  activeFilter: string;
  onFilterReset: () => void;
}

const AssociationsGrid: React.FC<AssociationsGridProps> = ({ associations, isLoading, searchTerm, activeFilter, onFilterReset }) => {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg shadow-md overflow-hidden border border-border animate-pulse">
            {/* Cover image skeleton - reduced height */}
            <div className="h-20 bg-muted shimmer" />

            {/* Content skeleton - reduced padding */}
            <div className="p-2 space-y-2">
              <div className="h-3 bg-muted rounded w-3/4 shimmer" />
              <div className="h-2 bg-muted rounded w-full shimmer" />
              <div className="h-2 bg-muted rounded w-5/6 shimmer" />

              {/* Stats skeleton */}
              <div className="grid grid-cols-2 gap-2">
                <div className="h-2 bg-muted rounded w-full shimmer" />
                <div className="h-2 bg-muted rounded w-full shimmer" />
              </div>

              {/* Tags skeleton */}
              <div className="flex gap-1">
                <div className="h-4 bg-muted rounded-full w-12 shimmer" />
                <div className="h-4 bg-muted rounded-full w-16 shimmer" />
              </div>

              {/* Button skeleton */}
              <div className="h-6 bg-muted rounded-lg shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (associations.length === 0) {
    const isFiltered = activeFilter !== 'all' || searchTerm.trim() !== '';

    return (
      <div className="text-center py-16 bg-card/50 rounded-3xl border border-border/50 warm-dots">
        <div className="max-w-md mx-auto space-y-6">
          <div
            className="w-24 h-24 mx-auto bg-gradient-to-tr from-primary/20 to-secondary/20 
            rounded-full flex items-center justify-center"
          >
            <BookOpen className="h-12 w-12 text-primary" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">{isFiltered ? 'No associations found' : 'No associations yet'}</h3>
            <p className="text-muted-foreground">
              {isFiltered ? "Try adjusting your search or filter criteria to find what you're looking for." : 'Be the first to discover amazing associations on campus!'}
            </p>
          </div>

          {isFiltered ? (
            <Button variant="outline" onClick={onFilterReset} className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
              <RefreshCw className="h-4 w-4" />
              Reset Filters
            </Button>
          ) : (
            <Button
              className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 
                hover:to-secondary/90 transition-all duration-300"
            >
              <BookOpen className="h-4 w-4" />
              Explore associations
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground">{activeFilter === 'all' ? 'All Associations' : `${activeFilter} Associations`}</h2>
          <div className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">{associations.length} found</div>
        </div>

        {/* Optional: Sort or view options could go here */}
      </div>

      {/* Associations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {associations.map((association, index) => (
          <div
            key={association.id}
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both',
            }}
          >
            <AssociationCard association={association} />
          </div>
        ))}
      </div>

      {/* Load more section (if needed for pagination) */}
      {associations.length > 0 && associations.length % 9 === 0 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg" className="px-8 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
            Load More Associations
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssociationsGrid;
