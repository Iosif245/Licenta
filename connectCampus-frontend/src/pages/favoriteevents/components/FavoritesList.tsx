import React from 'react';
import { Button } from '@app/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@app/components/ui/card';
import { BookOpen } from 'lucide-react';
import FavoriteEventCard from './FavoriteEventCard';
import { FavoriteEvent } from './types';

interface FavoritesListProps {
  events: FavoriteEvent[];
  onRemoveFavorite: (id: number) => void;
  isLoading: boolean;
  searchTerm: string;
}

const FavoritesList = ({ events, onRemoveFavorite, isLoading, searchTerm }: FavoritesListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse border border-border">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardHeader className="h-20 pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-6 w-full bg-muted rounded mt-2"></div>
            </CardHeader>
            <CardContent className="h-24">
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <div className="h-10 w-full bg-muted rounded"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 border border-border rounded-lg bg-card">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No favorite events found</h3>
        <p className="text-muted-foreground mb-6">{searchTerm ? 'Try adjusting your search term.' : "You haven't added any events to your favorites yet."}</p>
        <Button asChild>
          <a href="/events">Browse Events</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map(event => (
        <FavoriteEventCard key={event.id} event={event} onRemoveFavorite={onRemoveFavorite} />
      ))}
    </div>
  );
};

export default FavoritesList;
