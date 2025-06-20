import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { getAnnouncementCommentsActionAsync } from '@app/store/actions/announcements/announcements-async-actions';
import { getEventByIdActionAsync } from '@app/store/actions/events/events-async-actions';
import { announcementCommentsSelector, commentsLoadingSelector } from '@app/store/selectors/announcements-selectors';
import { profileCurrentProfileSelector } from '@app/store/selectors/profile-selectors';
import { userSelector } from '@app/store/selectors/user-selectors';
import { selectedEventSelector } from '@app/store/selectors/events-selectors';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { CommentSection } from '@app/components/ui/comment-section';
import { IAnnouncement, IAnnouncementComment } from '@app/types/announcement';
import { X, Calendar, MapPin, Clock, MessageCircle, Heart, Share2, ExternalLink, Eye, Users, Loader2, Sparkles, FileText } from 'lucide-react';

interface AnnouncementModalProps {
  announcement: IAnnouncement | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onAddComment: (content: string, parentId?: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getEventStatus = (event: any): string => {
  if (!event) return 'general';

  const now = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  if (now < startDate) return 'upcoming';
  if (now >= startDate && now <= endDate) return 'ongoing';
  return 'past';
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
    case 'past':
      return { text: 'Past Event', className: 'bg-gray-100 text-gray-800 border-gray-200' };
    default:
      return { text: 'Event', className: 'bg-blue-100 text-blue-800 border-blue-200' };
  }
};

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ announcement, isOpen, onClose, onLike, onAddComment, onEditComment, onDeleteComment }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const commentsLoading = useAppSelector(commentsLoadingSelector);
  const currentProfile = useAppSelector(profileCurrentProfileSelector);
  const currentUser = useAppSelector(userSelector);
  const eventDetails = useAppSelector(selectedEventSelector);

  // Fetch comments directly from Redux store
  const comments = useAppSelector(state => (announcement ? announcementCommentsSelector(state, announcement.id) : []));

  const [localComments, setLocalComments] = useState<IAnnouncementComment[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eventLoading, setEventLoading] = useState(false);
  const [showComments, setShowComments] = useState(false); // Mobile toggle state

  // Body scroll lock functionality
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      // Add a small delay for animation
      const timer = setTimeout(() => setIsAnimating(true), 10);

      return () => {
        // Restore body scroll when modal is closed
        document.body.style.overflow = originalStyle;
        clearTimeout(timer);
      };
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Fetch comments when modal opens or announcement changes
  useEffect(() => {
    if (isOpen && announcement?.id) {
      dispatch(getAnnouncementCommentsActionAsync(announcement.id));
    }
  }, [dispatch, isOpen, announcement?.id]);

  // Fetch event details when modal opens and announcement has eventId
  useEffect(() => {
    if (isOpen && announcement?.eventId && (!eventDetails || (eventDetails as any)?.id !== announcement.eventId)) {
      setEventLoading(true);
      dispatch(getEventByIdActionAsync(announcement.eventId)).finally(() => setEventLoading(false));
    }
  }, [dispatch, isOpen, announcement?.eventId, eventDetails]);

  // Update local comments when props change
  useEffect(() => {
    setLocalComments(comments || []);
  }, [comments, announcement?.id]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !announcement) return null;

  // Handle enhanced announcement data - check for detailedAssociation and detailedEvent
  const enhancedAnnouncement = announcement as any;

  // Association details - prioritize detailedAssociation from enhanced data
  const associationData = enhancedAnnouncement.detailedAssociation || announcement.association;
  const associationName = associationData?.name || enhancedAnnouncement.associationName || announcement.association?.name || 'Unknown Association';
  const associationLogo = associationData?.logoUrl || associationData?.logo || announcement.association?.logoUrl || enhancedAnnouncement.associationLogoUrl;
  const isVerified = associationData?.isVerified || announcement.association?.isVerified || enhancedAnnouncement.isVerified || false;

  // Event details - prioritize fetched event details, then detailedEvent from enhanced data
  const eventData = eventDetails && (eventDetails as any)?.id === announcement.eventId ? eventDetails : enhancedAnnouncement.detailedEvent || announcement.event;
  const isEvent = !!announcement.eventId || !!eventData;
  const eventStatus = isEvent ? getEventStatus(eventData) : 'general';
  const statusBadge = getEventStatusBadge(eventStatus, isEvent);

  // Like data - handle various field names from different sources (backend returns camelCase)
  const likesCount = announcement.likesCount || (announcement as any).likeCount || enhancedAnnouncement.likeCount || (enhancedAnnouncement as any).likeCount || 0;
  const isLiked = announcement.isLiked || (announcement as any).isLikedByUser || enhancedAnnouncement.isLikedByUser || (enhancedAnnouncement as any).isLikedByUser || false;
  const publishedDate = announcement.publishedDate || announcement.createdAt;

  // Event details from fetched or enhanced data
  const eventTitle = eventData?.title || eventData?.name;
  const eventStartDate = eventData?.startDate;
  const eventEndDate = eventData?.endDate;
  const eventLocation = eventData?.location;
  const eventCapacity = eventData?.maxParticipants || eventData?.capacity;
  const eventRegistrationUrl = eventData?.registrationUrl;
  const canViewEventDetails = !!announcement.eventId;

  // Get current user profile for avatar
  const getCurrentUserAvatar = () => {
    if (!currentProfile) return null;

    // Try different possible avatar field names
    return (
      currentProfile.profilePictureUrl ||
      currentProfile.avatarUrl ||
      currentProfile.avatar ||
      currentProfile.profilePicture ||
      (currentProfile as any).photoUrl ||
      (currentProfile.studentProfile as any)?.avatarUrl ||
      (currentProfile.associationProfile as any)?.logo ||
      null
    );
  };

  const getCurrentUserName = () => {
    if (!currentProfile) return 'You';

    if (currentProfile.firstName && currentProfile.lastName) {
      return `${currentProfile.firstName} ${currentProfile.lastName}`;
    }

    return currentProfile.firstName || currentProfile.username || (currentProfile.studentProfile as any)?.firstName || (currentProfile.associationProfile as any)?.name || 'You';
  };

  // Get the actual current user ID for comment ownership
  const getCurrentUserId = () => {
    if (!currentUser || !currentProfile) return null;

    // Use the actual user ID from the authentication system
    if (currentUser.role === 'Student' && currentProfile.studentProfile?.id) {
      return currentProfile.studentProfile.id;
    } else if (currentUser.role === 'Association' && currentProfile.associationProfile?.id) {
      return currentProfile.associationProfile.id;
    }

    return null;
  };

  const handleViewEventDetails = () => {
    if (announcement.eventId) {
      // Close the modal first
      onClose();

      // Navigate to event details page
      if (eventData && (eventData as any).slug) {
        navigate(`/events/${(eventData as any).slug}`);
      } else {
        navigate(`/events/${announcement.eventId}`);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: announcement.title,
          text: announcement.content,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 w-screen h-screen bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-0 transition-all duration-200 ease-out ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleBackdropClick}
      style={{
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        className={`bg-background rounded-xl shadow-2xl border border-primary/30 w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden relative transform transition-all duration-200 ease-out mx-2 sm:mx-4 ${
          isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        style={{ margin: 0 }}
      >
        {/* Header */}
        <div className="relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5"></div>
          <div className="relative flex items-center justify-between p-4 border-b border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 shrink-0">
                <AvatarImage src={associationLogo} alt={associationName} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">{associationName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-primary text-lg">{associationName}</h3>
                  {isVerified && (
                    <Badge variant="secondary" className="h-5 px-2 text-xs bg-green-100 text-green-700 border-green-200 shrink-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(publishedDate)}
                  {announcement.updatedAt && announcement.updatedAt !== announcement.createdAt && <span className="ml-1 text-xs bg-muted px-1 py-0.5 rounded">(edited)</span>}
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col h-[calc(95vh-80px)] sm:h-[calc(90vh-80px)]">
          {/* Mobile Toggle Buttons */}
          <div className="lg:hidden flex border-b border-border/20 bg-background/50 shrink-0">
            <button
              onClick={() => setShowComments(false)}
              className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors ${
                !showComments ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="h-4 w-4 mr-2 inline" />
              Content
            </button>
            <button
              onClick={() => setShowComments(true)}
              className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors ${
                showComments ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageCircle className="h-4 w-4 mr-2 inline" />
              Comments ({localComments.length})
            </button>
          </div>

          {/* Main Content Area - Improved scroll behavior */}
          <div 
            className={`flex-1 min-w-0 lg:block ${showComments ? 'hidden' : 'block'}`} 
            style={{ 
              overflowY: 'auto', 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch' // Better iOS scrolling
            }}
          >
            <div className="space-y-6">
              {/* Announcement Image - Top of content */}
              {announcement.imageUrl && (
                <div className="relative overflow-hidden">
                  <img 
                    src={announcement.imageUrl} 
                    alt={announcement.title} 
                    className="w-full h-48 sm:h-64 lg:h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}

              <div className="p-4 sm:p-6 space-y-6">
                {/* Title and Type Badge */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight flex-1 min-w-0">
                        {announcement.title}
                      </h1>
                      <Badge variant="outline" className={`shrink-0 border px-2.5 py-1 text-xs font-medium ${statusBadge.className}`}>
                        {isEvent ? (
                          <>
                            <Calendar className="h-3 w-3 mr-1.5" />
                            {statusBadge.text}
                          </>
                        ) : (
                          <>
                            <MessageCircle className="h-3 w-3 mr-1.5" />
                            General
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    {/* Association info */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>by</span>
                      <span className="font-medium text-foreground">{announcement.association?.name || 'Unknown Association'}</span>
                      <span>•</span>
                      <span>{formatDate(announcement.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Interaction Bar */}
                <div className="flex items-center gap-4 py-3 border-y border-border/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 transition-all duration-200 h-8 px-3 ${
                      isLiked 
                        ? 'text-red-500 bg-red-50 hover:bg-red-100 border border-red-200' 
                        : 'hover:text-red-500 hover:bg-red-50'
                    }`}
                    onClick={() => {
                      console.log('Like button clicked, current status:', isLiked);
                      onLike();
                    }}
                  >
                    <Heart className={`h-4 w-4 transition-all ${isLiked ? 'fill-red-500 text-red-500' : ''}`} style={{ fill: isLiked ? '#ef4444' : 'none' }} />
                    <span className="text-sm font-medium">
                      {likesCount}
                    </span>
                  </Button>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {localComments.length}
                    </span>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 hover:text-primary hover:bg-primary/10 transition-all h-8 px-3" 
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Share</span>
                  </Button>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Description</h3>
                  </div>
                  
                  <div className="prose max-w-none">
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Details - Show if eventId exists */}
                {isEvent && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Event Details</h3>
                    </div>
                    
                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-foreground">{eventTitle || 'Event Announcement'}</div>
                        {canViewEventDetails && (
                          <Button variant="outline" size="sm" className="gap-2 hover:bg-primary hover:text-primary-foreground h-8 px-3" onClick={handleViewEventDetails}>
                            <Eye className="h-4 w-4" />
                            <span className="text-sm">View Event</span>
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-3">
                        {eventStartDate && (
                          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 rounded-lg p-3">
                            <Clock className="h-4 w-4 text-primary shrink-0" />
                            <span>
                              {formatDate(eventStartDate)}
                              {eventEndDate && <span> - {formatDate(eventEndDate)}</span>}
                            </span>
                          </div>
                        )}

                        {eventLocation && (
                          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 rounded-lg p-3">
                            <MapPin className="h-4 w-4 text-primary shrink-0" />
                            <span>{eventLocation}</span>
                          </div>
                        )}

                        {eventCapacity && (
                          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 rounded-lg p-3">
                            <Users className="h-4 w-4 text-primary shrink-0" />
                            <span>Capacity: {eventCapacity} participants</span>
                          </div>
                        )}
                      </div>

                      {eventRegistrationUrl && (
                        <Button variant="default" size="sm" className="gap-2 h-9 px-4" onClick={() => window.open(eventRegistrationUrl, '_blank')}>
                          <ExternalLink className="h-4 w-4" />
                          Register for Event
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Comments Section - At the bottom */}
                <div className="space-y-4 border-t border-border/30 pt-6">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Comments ({localComments.length})
                    </h3>
                  </div>
                  
                  <div className="bg-muted/20 rounded-lg border border-border/30 p-4">
                    {commentsLoading ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                        <span className="text-sm text-muted-foreground">Loading comments...</span>
                      </div>
                    ) : (
                      <CommentSection
                        comments={localComments}
                        onAddComment={onAddComment}
                        onEditComment={onEditComment}
                        onDeleteComment={onDeleteComment}
                        currentUserId={getCurrentUserId()}
                        currentUserName={getCurrentUserName()}
                        currentUserAvatar={getCurrentUserAvatar()}
                        showTitle={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Comments View - Improved scroll behavior */}
          <div 
            className={`flex-1 min-w-0 lg:hidden ${showComments ? 'block' : 'hidden'}`} 
            style={{ 
              overflowY: 'auto', 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch' // Better iOS scrolling
            }}
          >
            <div className="p-4">
              {commentsLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                  <span className="text-sm text-muted-foreground">Loading comments...</span>
                </div>
              ) : (
                <CommentSection
                  comments={localComments}
                  onAddComment={onAddComment}
                  onEditComment={onEditComment}
                  onDeleteComment={onDeleteComment}
                  currentUserId={getCurrentUserId()}
                  currentUserName={getCurrentUserName()}
                  currentUserAvatar={getCurrentUserAvatar()}
                  showTitle={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
