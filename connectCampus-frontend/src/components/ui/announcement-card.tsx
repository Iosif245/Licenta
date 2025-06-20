import { Card, CardContent, CardHeader } from '@app/components/ui/card';
import { Badge } from '@app/components/ui/badge';
import { Button } from '@app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Calendar, MessageCircle, Heart, Share2, Clock, Eye, ExternalLink } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { IAnnouncement } from '@app/types/announcement';
import { useNavigate } from 'react-router-dom';
import { getApi } from '@app/api';

interface AnnouncementCardProps {
  announcement: IAnnouncement;
  onClick: () => void;
  onLike: () => void;
  compact?: boolean;
}

interface AssociationData {
  id: string;
  name: string;
  logoUrl?: string;
  isVerified: boolean;
  slug?: string;
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const truncateContent = (content: string, maxLength: number = 150): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

const getEventStatus = (event: any): string => {
  if (!event) return 'general';

  const now = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  if (now < startDate) return 'upcoming';
  if (now >= startDate && now <= endDate) return 'ongoing';
  return 'completed';
};

const getEventStatusBadge = (status: string, isEvent: boolean) => {
  if (!isEvent) {
    return { text: 'General', className: 'bg-purple-100 text-purple-800 border-purple-200' };
  }

  switch (status) {
    case 'upcoming':
      return { text: 'Upcoming Event', className: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'ongoing':
      return { text: 'Live Event', className: 'bg-green-100 text-green-800 border-green-200 animate-pulse' };
    case 'completed':
      return { text: 'Past Event', className: 'bg-gray-100 text-gray-800 border-gray-200' };
    default:
      return { text: 'Event', className: 'bg-blue-100 text-blue-800 border-blue-200' };
  }
};

export const AnnouncementCard = ({ announcement, onClick, onLike, compact = false }: AnnouncementCardProps) => {
  const navigate = useNavigate();
  const [associationData, setAssociationData] = useState<AssociationData | null>(null);
  const [loadingAssociation, setLoadingAssociation] = useState(false);

  // Fetch association data
  useEffect(() => {
    const fetchAssociationData = async () => {
      if (!announcement.associationId) return;

      setLoadingAssociation(true);
      try {
        const api = getApi();
        const response = await api.get(`/api/associations/${announcement.associationId}`);
        setAssociationData({
          id: response.data.id,
          name: response.data.name,
          logoUrl: response.data.logo,
          isVerified: response.data.isVerified,
          slug: response.data.slug,
        });
      } catch (error) {
        console.error('Failed to fetch association data:', error);
        // Fallback to announcement data
        setAssociationData({
          id: announcement.associationId,
          name: announcement.association?.name || 'Unknown Association',
          logoUrl: announcement.association?.logoUrl,
          isVerified: announcement.association?.isVerified || false,
        });
      } finally {
        setLoadingAssociation(false);
      }
    };

    fetchAssociationData();
  }, [announcement.associationId, announcement.association]);

  // Handle potential field mismatches between backend and frontend
  const associationName = associationData?.name || announcement.association?.name || (announcement as any).associationName || 'Unknown Association';
  const associationLogo = associationData?.logoUrl || announcement.association?.logoUrl || (announcement as any).associationLogoUrl;
  const isVerified = associationData?.isVerified || announcement.association?.isVerified || (announcement as any).isVerified || false;
  const eventTitle = announcement.event?.title || (announcement as any).eventName || (announcement as any).eventTitle;
  const eventStartDate = announcement.event?.startDate || (announcement as any).eventStartDate;
  // Handle backend field names (backend returns camelCase: likeCount, commentCount, isLikedByUser)
  const likesCount = announcement.likesCount || (announcement as any).likeCount || 0;
  const commentsCount = announcement.commentsCount || (announcement as any).commentCount || 0;
  const isLiked = announcement.isLiked || (announcement as any).isLikedByUser || false;
  const publishedDate = announcement.publishedDate || announcement.createdAt;

  // Simple logic: if eventId exists, it's an event, otherwise general
  const isEvent = !!announcement.eventId;
  const eventStatus = isEvent ? getEventStatus(announcement.event) : 'general';
  const statusBadge = getEventStatusBadge(eventStatus, isEvent);

  const canViewEventDetails = isEvent && (eventStatus === 'upcoming' || eventStatus === 'ongoing' || eventStatus === 'completed');

  const handleViewEventDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (announcement.event && (announcement.event as any).slug) {
      navigate(`/events/${(announcement.event as any).slug}`);
    } else if (announcement.eventId) {
      navigate(`/events/${announcement.eventId}`);
    }
  };

  const handleAssociationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (associationData?.slug) {
      navigate(`/associations/${associationData.slug}`);
    } else if (associationData?.id) {
      navigate(`/associations/${associationData.id}`);
    }
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 bg-background/60 backdrop-blur border-primary/10 hover:border-primary/30 relative overflow-hidden"
      onClick={onClick}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Cover Image */}
      {announcement.imageUrl && !compact && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={announcement.imageUrl || '/placeholder.svg'}
            alt={announcement.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Type Badge on Cover */}
          <div className="absolute top-3 left-3">
            <Badge className={`text-xs px-2 py-1 ${statusBadge.className}`}>
              {isEvent ? (
                <>
                  <Calendar className="h-3 w-3 mr-1" />
                  {statusBadge.text}
                </>
              ) : (
                <>
                  <MessageCircle className="h-3 w-3 mr-1" />
                  General
                </>
              )}
            </Badge>
          </div>

          {/* Event View Button Overlay */}
          {canViewEventDetails && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button size="sm" variant="secondary" className="gap-1 shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white text-xs h-7 px-2" onClick={handleViewEventDetails}>
                <Eye className="h-3 w-3" />
                View Event
              </Button>
            </div>
          )}
        </div>
      )}

      <CardHeader className={`${compact ? 'pb-1 pt-3' : 'pb-2'} relative`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Avatar className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all`}>
              <AvatarImage src={associationLogo || '/placeholder.svg'} />
              <AvatarFallback className="avatar-fallback text-primary font-semibold text-sm">{associationName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAssociationClick}
                  className={`font-semibold ${compact ? 'text-xs' : 'text-sm'} group-hover:text-primary transition-colors hover:underline focus:outline-none focus:underline`}
                  disabled={loadingAssociation}
                >
                  {loadingAssociation ? 'Loading...' : associationName}
                </button>
                {isVerified && (
                  <Badge variant="secondary" className="h-4 px-1.5 text-xs bg-green-100 text-green-700 border-green-200">
                    ✓
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(publishedDate)}
              </div>
            </div>
          </div>

          {/* Type Badge (when no cover image or compact mode) */}
          {(!announcement.imageUrl || compact) && (
            <div className="flex flex-col gap-2">
              <Badge className={`text-xs px-2 py-1 ${statusBadge.className}`}>
                {isEvent ? (
                  <>
                    <Calendar className="h-3 w-3 mr-1" />
                    {statusBadge.text}
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-3 w-3 mr-1" />
                    General
                  </>
                )}
              </Badge>
              {canViewEventDetails && (
                <Button size="sm" variant="outline" className="gap-1 h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleViewEventDetails}>
                  <Eye className="h-3 w-3" />
                  View
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={`${compact ? 'pt-0 pb-3' : 'pt-0'} relative`}>
        <h2 className={`${compact ? 'text-base' : 'text-lg'} font-bold ${compact ? 'mb-1' : 'mb-2'} group-hover:gradient-text transition-all duration-300 leading-tight`}>
          {announcement.title}
        </h2>

        <p className={`text-muted-foreground ${compact ? 'mb-2' : 'mb-3'} leading-relaxed line-clamp-${compact ? '2' : '3'} text-sm`}>
          {truncateContent(announcement.content, compact ? 100 : 150)}
        </p>

        {/* Show event info if eventId exists */}
        {isEvent && !compact && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3 mb-3 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm flex-1">
                <Calendar className="h-4 w-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium block truncate">{eventTitle || 'Event Announcement'}</span>
                  {eventStartDate && (
                    <span className="text-muted-foreground text-xs">
                      {new Date(eventStartDate).toLocaleDateString()} at {new Date(eventStartDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
              {canViewEventDetails && (
                <Button size="sm" variant="ghost" className="gap-1 h-6 px-2 text-xs hover:bg-primary hover:text-primary-foreground" onClick={handleViewEventDetails}>
                  <ExternalLink className="h-3 w-3" />
                  Details
                </Button>
              )}
            </div>
          </div>
        )}

        <div className={`flex items-center justify-between ${compact ? 'pt-2' : 'pt-3'} border-t border-primary/10`}>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size={compact ? 'sm' : 'sm'}
              className={`gap-1 transition-all duration-200 ${compact ? 'h-7 px-2' : ''} ${
                isLiked ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'hover:text-red-500 hover:bg-red-50'
              }`}
              onClick={e => {
                e.stopPropagation();
                onLike();
              }}
            >
              <Heart className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} transition-all ${isLiked ? 'fill-red-500 text-red-500' : ''}`} style={{ fill: isLiked ? '#ef4444' : 'none' }} />
              <span className="text-xs">{likesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size={compact ? 'sm' : 'sm'}
              className={`gap-2 hover:text-primary hover:bg-primary/10 transition-all hover:scale-105 ${compact ? 'h-7 px-2' : ''}`}
            >
              <MessageCircle className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
              <span className="text-xs">{commentsCount}</span>
            </Button>
          </div>

          {!compact && (
            <Button variant="ghost" size="sm" className="gap-2 hover:text-primary hover:bg-primary/10 transition-all hover:scale-105 opacity-0 group-hover:opacity-100">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
