/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import {
  getAnnouncementsActionAsync,
  loadMoreAnnouncementsActionAsync,
  likeAnnouncementActionAsync,
  getAnnouncementCommentsActionAsync,
  createAnnouncementCommentActionAsync,
  updateAnnouncementCommentActionAsync,
  deleteAnnouncementCommentActionAsync,
} from '@app/store/actions/announcements/announcements-async-actions';
import { getAnnouncementByIdRequest } from '@app/api/requests/announcement-requests';
import { getAssociationByIdRequest } from '@app/api/requests/association-requests';
import { getEventByIdRequest } from '@app/api/requests/event-requests';
import {
  announcementsSelector,
  announcementsLoadingSelector,
  announcementsErrorSelector,
  announcementsPaginationSelector,
  announcementsSearchQuerySelector,
} from '@app/store/selectors/announcements-selectors';
import { AnnouncementCard } from '@app/components/ui/announcement-card';
import { AnnouncementModal } from '@app/components/ui/announcement-modal';
import { Button } from '@app/components/ui/button';
import { Card, CardContent } from '@app/components/ui/card';
import { Input } from '@app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { Search, RefreshCw, Megaphone, AlertCircle } from 'lucide-react';
import { IAnnouncement } from '@app/types/announcement';

// Enhanced announcement interface with detailed data
interface IEnhancedAnnouncement extends IAnnouncement {
  detailedAssociation?: any;
  detailedEvent?: any;
  isEnriched?: boolean;
}

const Announcements = () => {
  const dispatch = useAppDispatch();
  const announcements = useAppSelector(announcementsSelector);
  const loading = useAppSelector(announcementsLoadingSelector);
  const error = useAppSelector(announcementsErrorSelector);
  const pagination = useAppSelector(announcementsPaginationSelector);
  const searchQuery = useAppSelector(announcementsSearchQuerySelector);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncement | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery || '');
  const [enrichedAnnouncements, setEnrichedAnnouncements] = useState<IEnhancedAnnouncement[]>([]);
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'events' | 'general'>('all');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Available categories for filtering
  const categories = ['all', 'events', 'general'];

  // Function to enrich a single announcement with detailed data
  const enrichAnnouncement = async (announcement: IAnnouncement): Promise<IEnhancedAnnouncement> => {
    try {
      console.log(`🔍 Enriching announcement: ${announcement.id}`);

      // 1. Get detailed announcement data
      const detailedAnnouncement = await getAnnouncementByIdRequest(announcement.id);

      // 2. Get detailed association data
      const detailedAssociation = await getAssociationByIdRequest(announcement.associationId);

      // 3. Get detailed event data if eventId exists
      let detailedEvent = null;
      if (announcement.eventId) {
        try {
          detailedEvent = await getEventByIdRequest(announcement.eventId);
        } catch (error) {
          console.warn(`Failed to fetch event ${announcement.eventId}:`, error);
        }
      }

      // 4. Merge all data and determine tag type
      const enrichedAnnouncement: IEnhancedAnnouncement = {
        ...announcement,
        ...detailedAnnouncement,
        detailedAssociation,
        detailedEvent,
        isEnriched: true,
        // Simple tag logic: if eventId exists, it's an event, otherwise general
        event: detailedEvent || announcement.event,
        association: {
          ...announcement.association,
          ...detailedAssociation,
        },
      };

      console.log(`✅ Enriched announcement: ${announcement.id}`, {
        hasEvent: !!enrichedAnnouncement.eventId,
        tag: enrichedAnnouncement.eventId ? 'event' : 'general',
        associationName: enrichedAnnouncement.detailedAssociation?.name,
        eventTitle: enrichedAnnouncement.detailedEvent?.title,
      });

      return enrichedAnnouncement;
    } catch (error) {
      console.error(`❌ Failed to enrich announcement ${announcement.id}:`, error);
      // Return original announcement with enrichment flag
      return {
        ...announcement,
        isEnriched: false,
      };
    }
  };

  // Function to enrich all announcements
  const enrichAllAnnouncements = async (announcementsList: IAnnouncement[]) => {
    if (!announcementsList || announcementsList.length === 0) {
      setEnrichedAnnouncements([]);
      return;
    }

    setEnrichmentLoading(true);
    console.log(`🚀 Starting enrichment for ${announcementsList.length} announcements`);

    try {
      // Process announcements in parallel for better performance
      const enrichmentPromises = announcementsList.map(announcement => enrichAnnouncement(announcement));

      const enrichedResults = await Promise.allSettled(enrichmentPromises);

      const successfulEnrichments = enrichedResults
        .filter((result): result is PromiseFulfilledResult<IEnhancedAnnouncement> => result.status === 'fulfilled')
        .map(result => result.value);

      console.log(`✅ Enrichment completed: ${successfulEnrichments.length}/${announcementsList.length} successful`);
      setEnrichedAnnouncements(successfulEnrichments);
    } catch (error) {
      console.error('❌ Failed to enrich announcements:', error);
      // Fallback to original announcements
      setEnrichedAnnouncements(announcementsList.map(ann => ({ ...ann, isEnriched: false })));
    } finally {
      setEnrichmentLoading(false);
    }
  };

  // Load initial announcements (without search/filter - we'll filter on frontend)
  useEffect(() => {
    dispatch(
      getAnnouncementsActionAsync({
        page: 1,
        pageSize: 50, // Load more items since we're filtering on frontend
      }),
    );
  }, [dispatch]);

  // Enrich announcements when they change
  useEffect(() => {
    if (announcements && announcements.length > 0) {
      enrichAllAnnouncements(announcements);
    } else {
      setEnrichedAnnouncements([]);
    }
  }, [announcements]);

  // Filter enriched announcements based on search and filter
  const filteredAnnouncements = React.useMemo(() => {
    if (!enrichedAnnouncements || enrichedAnnouncements.length === 0) {
      return [];
    }

    let filtered = enrichedAnnouncements;

    // Apply search filter
    if (localSearchTerm.trim()) {
      const searchLower = localSearchTerm.toLowerCase();
      filtered = filtered.filter(
        announcement =>
          announcement.title.toLowerCase().includes(searchLower) ||
          announcement.content.toLowerCase().includes(searchLower) ||
          (announcement as any).associationName?.toLowerCase().includes(searchLower) ||
          announcement.association?.name?.toLowerCase().includes(searchLower),
      );
    }

    // Apply type filter
    if (filterType && filterType !== 'all') {
      filtered = filtered.filter(announcement => {
        if (filterType === 'events') {
          return !!announcement.eventId;
        } else if (filterType === 'general') {
          return !announcement.eventId;
        }
        return true;
      });
    }

    return filtered;
  }, [enrichedAnnouncements, localSearchTerm, filterType]);

  // Infinite scroll setup (simplified since we're filtering on frontend)
  useEffect(() => {
    if (loading || !pagination?.hasNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && pagination?.hasNextPage && !loading) {
          dispatch(
            loadMoreAnnouncementsActionAsync({
              page: pagination.currentPage + 1,
              pageSize: 50,
            }),
          );
        }
      },
      { threshold: 0.1 },
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [dispatch, loading, pagination]);

  // Handle search with debouncing (now just for local state)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // We don't need to dispatch to Redux anymore since we're filtering locally
      // The localSearchTerm state change will trigger the filteredAnnouncements memo
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm]);

  const handleSearch = useCallback((value: string) => {
    setLocalSearchTerm(value);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setFilterType(category as 'all' | 'events' | 'general');
  }, []);

  const handleRefresh = useCallback(() => {
    dispatch(
      getAnnouncementsActionAsync({
        page: 1,
        pageSize: 50,
      }),
    );
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleAnnouncementClick = useCallback(
    (announcement: IAnnouncement) => {
      setSelectedAnnouncement(announcement);
      // Fetch comments only when announcement is selected
      if (announcement.id) {
        dispatch(getAnnouncementCommentsActionAsync(announcement.id));
      }
    },
    [dispatch],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedAnnouncement(null);
  }, []);

  // Update selectedAnnouncement when announcements list changes (e.g., after like/unlike)
  useEffect(() => {
    if (selectedAnnouncement && enrichedAnnouncements) {
      const updatedAnnouncement = enrichedAnnouncements.find(a => a.id === selectedAnnouncement.id);
      if (updatedAnnouncement && (updatedAnnouncement.likesCount !== selectedAnnouncement.likesCount || updatedAnnouncement.isLiked !== selectedAnnouncement.isLiked)) {
        setSelectedAnnouncement(updatedAnnouncement);
      }
    }
  }, [enrichedAnnouncements, selectedAnnouncement]);

  const handleToggleLike = useCallback(
    async (announcementId: string) => {
      try {
        await dispatch(likeAnnouncementActionAsync(announcementId)).unwrap();
        // Refresh announcements to get updated like counts
        dispatch(
          getAnnouncementsActionAsync({
            page: 1,
            pageSize: 50,
          }),
        );
      } catch (error) {
        console.error('Failed to toggle like:', error);
      }
    },
    [dispatch],
  );

  const handleAddComment = useCallback(
    async (announcementId: string, content: string, parentId?: string) => {
      try {
        await dispatch(
          createAnnouncementCommentActionAsync({
            announcementId,
            commentData: { content, parentId },
          }),
        ).unwrap();
        // Refresh comments and announcements
        dispatch(getAnnouncementCommentsActionAsync(announcementId));
        dispatch(
          getAnnouncementsActionAsync({
            page: 1,
            pageSize: 50,
          }),
        );
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    },
    [dispatch, searchQuery, filterType],
  );

  const handleEditComment = useCallback(
    async (commentId: string, content: string) => {
      try {
        if (!selectedAnnouncement) return;
        await dispatch(
          updateAnnouncementCommentActionAsync({
            announcementId: selectedAnnouncement.id,
            commentId,
            commentData: { content },
          }),
        ).unwrap();
        // Refresh comments and announcements
        dispatch(getAnnouncementCommentsActionAsync(selectedAnnouncement.id));
        dispatch(
          getAnnouncementsActionAsync({
            page: 1,
            pageSize: 10,
            search: searchQuery,
            type: filterType,
          }),
        );
      } catch (error) {
        console.error('Failed to edit comment:', error);
      }
    },
    [dispatch, selectedAnnouncement, searchQuery, filterType],
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      try {
        if (!selectedAnnouncement) return;
        await dispatch(
          deleteAnnouncementCommentActionAsync({
            announcementId: selectedAnnouncement.id,
            commentId,
          }),
        ).unwrap();
        // Refresh comments and announcements
        dispatch(getAnnouncementCommentsActionAsync(selectedAnnouncement.id));
        dispatch(
          getAnnouncementsActionAsync({
            page: 1,
            pageSize: 10,
            search: searchQuery,
            type: filterType,
          }),
        );
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    },
    [dispatch, selectedAnnouncement, searchQuery, filterType],
  );

  const AnnouncementsSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-6 bg-muted rounded w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-8 bg-muted rounded w-16"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-4">We couldn't load the announcements. Please try again.</p>
            <Button onClick={handleRetry} className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200">
              <RefreshCw className="h-4 w-4 mr-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 md:px-4 py-4 max-w-7xl space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Recent Announcements</h1>
            <p className="text-muted-foreground mt-1 text-sm">Stay updated with the latest news and events from campus associations</p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || enrichmentLoading}
            className="gap-2 h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <RefreshCw className={`h-3 w-3 ${loading || enrichmentLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search announcements..." value={localSearchTerm} onChange={e => handleSearch(e.target.value)} className="pl-8 h-8 text-sm" />
          </div>
          <Select value={filterType || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-40 h-8 text-sm">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category} className="text-sm">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {(loading || enrichmentLoading) && enrichedAnnouncements.length === 0 && <AnnouncementsSkeleton />}

        {/* Announcements List */}
        {!loading && !enrichmentLoading && filteredAnnouncements.length === 0 && enrichedAnnouncements.length > 0 && (
          <div className="text-center py-8">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">No announcements found</h3>
            <p className="text-muted-foreground text-sm">
              {localSearchTerm || filterType !== 'all' ? 'Try adjusting your search or filter criteria' : 'Check back later for new announcements'}
            </p>
          </div>
        )}

        {!loading && !enrichmentLoading && enrichedAnnouncements.length === 0 && (
          <div className="text-center py-8">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">No announcements available</h3>
            <p className="text-muted-foreground text-sm">Check back later for new announcements</p>
          </div>
        )}

        {/* Filtered Announcements */}
        {filteredAnnouncements.length > 0 && (
          <div className="space-y-2">
            {enrichmentLoading && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Enriching announcement data...
                </div>
              </div>
            )}
            {filteredAnnouncements.map(announcement => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onClick={() => handleAnnouncementClick(announcement)}
                onLike={() => handleToggleLike(announcement.id)}
                compact={true}
              />
            ))}
          </div>
        )}

        {/* Load More Trigger */}
        {pagination?.hasNextPage && (
          <div ref={loadingRef} className="text-center py-3">
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Loading more announcements...
            </div>
          </div>
        )}

        {/* Announcement Modal */}
        {selectedAnnouncement && (
          <AnnouncementModal
            announcement={selectedAnnouncement}
            isOpen={!!selectedAnnouncement}
            onClose={handleCloseModal}
            onLike={() => handleToggleLike(selectedAnnouncement.id)}
            onAddComment={(content, parentId) => handleAddComment(selectedAnnouncement.id, content, parentId)}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
        )}
      </div>
    </div>
  );
};

export default Announcements;
