import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch } from '@app/store';
import { unfollowAssociationActionAsync } from '@app/store/actions/follow/follow-async-actions';
import { IFollowedAssociationResponse } from '@app/types/follow/IFollowResponse';
import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Calendar, MapPin, Shield, Users, Loader2, ExternalLink, UserMinus } from 'lucide-react';

interface FollowedAssociationCardProps {
  association: IFollowedAssociationResponse;
  studentId: string;
  onUnfollow?: () => void;
  delayAnimation?: number;
  eventsCount?: number;
  followersCount?: number;
}

const FollowedAssociationCard: React.FC<FollowedAssociationCardProps> = ({ association, studentId, onUnfollow, delayAnimation = 0, eventsCount = 0, followersCount = 0 }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isUnfollowing, setIsUnfollowing] = useState(false);

  const handleUnfollow = async () => {
    if (!studentId || isUnfollowing || !association?.id) return;

    setIsUnfollowing(true);
    try {
      await dispatch(
        unfollowAssociationActionAsync({
          studentId,
          associationId: association.id,
        }),
      );

      if (onUnfollow) {
        onUnfollow();
      }
    } catch (error) {
      console.error('Error unfollowing association:', error);
    } finally {
      setIsUnfollowing(false);
    }
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-sm" style={{ transitionDelay: `${delayAnimation}ms` }}>
      <div className="relative">
        {/* Cover Image - reduced height */}
        <div className="h-16 relative overflow-hidden">
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-110">
            {association.coverImage ? (
              <img src={association.coverImage} alt={`${association.name} cover`} className="w-full h-full object-cover" />
            ) : (
              <div
                style={{
                  background: `linear-gradient(135deg, 
                    hsl(${((association.name?.charCodeAt(0) || 0) * 7) % 360}, 65%, 70%), 
                    hsl(${((association.name?.charCodeAt(1) || 0) * 11) % 360}, 60%, 80%),
                    hsl(${((association.name?.charCodeAt(2) || 0) * 13) % 360}, 55%, 75%)
                  )`,
                }}
                className="w-full h-full"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
            }}
          />

          {/* Verified badge - smaller */}
          {association.isVerified && (
            <div className="absolute top-1 right-1 flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-600/90 backdrop-blur-sm rounded-full">
              <Shield className="w-2 h-2 text-white" />
              <span className="text-[10px] font-medium text-white">Verified</span>
            </div>
          )}

          {/* Logo - smaller */}
          <div className="absolute bottom-1 left-1">
            <div className="w-8 h-8 rounded-md bg-white/95 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg">
              {association.logo ? (
                <img src={association.logo} alt={`${association.name} logo`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content - reduced padding */}
        <CardContent className="p-2 space-y-2">
          {/* Header - smaller */}
          <div>
            <h3 className="font-semibold text-xs truncate mb-0.5">{association.name}</h3>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {association.category}
            </Badge>
          </div>

          {/* Details - more compact */}
          <div className="space-y-1">
            {association.location && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                <span className="truncate">{association.location}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <div className="flex items-center gap-0.5">
                <Users className="w-2.5 h-2.5" />
                <span>{followersCount} followers</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Calendar className="w-2.5 h-2.5" />
                <span>{eventsCount} events</span>
              </div>
            </div>
          </div>

          {/* Actions - smaller buttons */}
          <div className="flex items-center gap-1.5 pt-1">
            <Link to={`/associations/${association.slug}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full h-6 text-[10px]">
                <ExternalLink className="w-2.5 h-2.5 mr-0.5" />
                View
              </Button>
            </Link>
            <Button variant="destructive" size="sm" className="h-6 px-2 text-[10px]" onClick={handleUnfollow} disabled={isUnfollowing}>
              {isUnfollowing ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <UserMinus className="w-2.5 h-2.5" />}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default FollowedAssociationCard;
