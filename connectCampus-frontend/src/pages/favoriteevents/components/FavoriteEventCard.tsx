import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Calendar, MapPin, Users, Clock, Heart, HeartOff } from 'lucide-react';
import { FavoriteEvent } from './types';

interface FavoriteEventCardProps {
  event: FavoriteEvent;
  onRemoveFavorite: (id: number) => void;
}

const FavoriteEventCard = ({ event, onRemoveFavorite }: FavoriteEventCardProps) => {
  return (
    <Card className="overflow-hidden border border-border group">
      <div className="relative">
        <img src={event.image || '/placeholder.svg'} alt={event.title} className="h-48 w-full object-cover transition-transform group-hover:scale-105 duration-300" />
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background text-primary"
            onClick={() => onRemoveFavorite(event.id)}
          >
            <Heart className="h-5 w-5 fill-current" />
          </Button>
        </div>
        <Badge className="absolute top-3 left-3" variant={event.status === 'past' ? 'outline' : 'default'}>
          {event.category}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {event.association}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4 text-primary" />
          {event.date}
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="mr-2 h-4 w-4 text-primary" />
          {event.time}
        </div>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4 text-primary" />
          {event.location}
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-4 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onRemoveFavorite(event.id)}>
          <HeartOff className="mr-1.5 h-4 w-4" />
          Remove
        </Button>
        <Button size="sm" variant={event.status === 'past' ? 'outline' : 'default'}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FavoriteEventCard;
