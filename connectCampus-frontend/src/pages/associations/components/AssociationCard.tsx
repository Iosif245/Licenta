import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Calendar, MapPin, Shield, Globe, Users } from 'lucide-react';
import { IAssociationSummaryResponse } from '@app/types/association/IAssociationResponse';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@app/store';
import { getEventsByAssociationActionAsync } from '@app/store/actions/events/events-async-actions';
import { getAssociationFollowersActionAsync } from '@app/store/actions/follow/follow-async-actions';

interface AssociationCardProps {
  association: IAssociationSummaryResponse;
}

const AssociationCard: React.FC<AssociationCardProps> = ({ association }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [totalEvents, setTotalEvents] = useState<any[]>([]);
  const [totalFollowers, setTotalFollowers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use Redux dispatch
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchAssociationData = async () => {
      if (!association.id) return;

      setIsLoading(true);
      try {
        const associationId = association.id;

        // Fetch all events by association using Redux action
        const allEventsResult = await dispatch(
          getEventsByAssociationActionAsync({
            associationId,
            params: { upcomingOnly: false },
          }),
        ).unwrap();

        // Fetch followers by association using Redux action
        const followersResult = await dispatch(
          getAssociationFollowersActionAsync({
            associationId,
          }),
        ).unwrap();

        // Set the data
        setTotalEvents(allEventsResult?.events || []);
        setTotalFollowers(followersResult?.followers || followersResult || []);
      } catch (error) {
        console.error('Error fetching association data:', error);
        // Set empty arrays on error
        setTotalEvents([]);
        setTotalFollowers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssociationData();
  }, [dispatch, association.id]);

  return (
    <div
      className={`group relative bg-card rounded-lg overflow-hidden border border-border 
        transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-1 shadow-sm`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image - reduced height */}
      <div className="relative h-20 overflow-hidden">
        <img
          src={association.coverImage || '/placeholder.svg'}
          alt={`${association.name} cover`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Verified Status Badge on Cover - smaller */}
        <div
          className={`absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm
            ${association.isVerified ? 'bg-green-500/90 text-white border border-green-400/30' : 'bg-gray-600/90 text-white border border-gray-500/30'}`}
        >
          <Shield className="h-2 w-2" />
          {association.isVerified ? 'Verified' : 'Unverified'}
        </div>

        {/* Logo positioned on cover - smaller */}
        <div className="absolute bottom-2 left-2">
          <div className="w-10 h-10 rounded-lg bg-white/95 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg">
            <img src={association.logo || '/placeholder.svg'} alt={`${association.name} logo`} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Card Content - reduced padding */}
      <div className="p-2 space-y-2">
        {/* Name and Category - smaller */}
        <div>
          <h3 className="font-bold text-xs truncate mb-1 text-foreground">{association.name}</h3>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {association.category}
          </Badge>
        </div>

        {/* Stats Row - smaller */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-0.5">
            <Calendar className="h-2.5 w-2.5 text-primary/70" />
            <span className={`font-medium ${isLoading ? 'animate-pulse' : ''}`}>{isLoading ? association.events : totalEvents.length || association.events || 0}</span>
            <span>events</span>
          </div>

          <div className="flex items-center gap-0.5">
            <Users className="h-2.5 w-2.5 text-secondary/70" />
            <span className={`font-medium ${isLoading ? 'animate-pulse' : ''}`}>{isLoading ? association.followers : totalFollowers.length || association.followers || 0}</span>
            <span>followers</span>
          </div>
        </div>

        {/* Location - smaller */}
        {association.location && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="h-2.5 w-2.5 text-accent/70 flex-shrink-0" />
            <span className="truncate">{association.location}</span>
          </div>
        )}

        {/* Additional Info - smaller */}
        <div className="flex flex-wrap gap-1">
          {/* Founded Year */}
          <div className="inline-flex items-center px-1.5 py-0.5 bg-primary/10 rounded-md text-[10px] text-primary font-medium">Est. {association.foundedYear}</div>

          {/* Website if available */}
          {association.website && (
            <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-secondary/10 rounded-md text-[10px] text-secondary font-medium">
              <Globe className="h-2 w-2" />
              Website
            </div>
          )}
        </div>

        {/* Action Button - smaller */}
        <Link to={`/associations/${association.slug}`} className="block pt-1">
          <Button className="w-full text-xs h-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300">
            View Profile
          </Button>
        </Link>
      </div>

      {/* Subtle hover effect */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg" />
      </div>
    </div>
  );
};

export default AssociationCard;
