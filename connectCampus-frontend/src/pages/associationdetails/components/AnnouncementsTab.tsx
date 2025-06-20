import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import {
  getAnnouncementsActionAsync,
  getAnnouncementCommentsActionAsync,
  createAnnouncementCommentActionAsync,
  updateAnnouncementCommentActionAsync,
  deleteAnnouncementCommentActionAsync,
  likeAnnouncementActionAsync,
} from '@app/store/actions/announcements/announcements-async-actions';
import { getAssociationActionAsync } from '@app/store/actions/association/association-async-actions';
import { getAnnouncementByIdRequest } from '@app/api/requests/announcement-requests';
import { getAssociationByIdRequest } from '@app/api/requests/association-requests';
import { getEventByIdRequest } from '@app/api/requests/event-requests';
import { announcementsSelector, announcementsLoadingSelector } from '@app/store/selectors/announcements-selectors';
import { associationCurrentAssociationSelector } from '@app/store/selectors/association-selectors';
import { Button } from '@app/components/ui/button';
import { TabsContent } from '@app/components/ui/tabs';
import { FileText, RefreshCw } from 'lucide-react';
import { AnnouncementModal } from '@app/components/ui/announcement-modal';
import { AnnouncementCard } from '@app/components/ui/announcement-card';
import { IAnnouncement } from '@app/types/announcement';

// Enhanced announcement interface with detailed data
interface IEnhancedAnnouncement extends IAnnouncement {
  detailedAssociation?: any;
  detailedEvent?: any;
  isEnriched?: boolean;
}

interface AnnouncementsTabProps {
  associationId: string;
}

const AnnouncementsTab = ({ associationId }: AnnouncementsTabProps) => {
  const dispatch = useAppDispatch();
  const announcements = useAppSelector(announcementsSelector);
  const loading = useAppSelector(announcementsLoadingSelector);
  const association = useAppSelector(associationCurrentAssociationSelector);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncement | null>(null);
  const [enrichedAnnouncements, setEnrichedAnnouncements] = useState<IEnhancedAnnouncement[]>([]);
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);

  // Function to enrich a single announcement with detailed data
  const enrichAnnouncement = async (announcement: IAnnouncement): Promise<IEnhancedAnnouncement> => {
    try {
      console.log(`🔍 AnnouncementsTab - Enriching announcement: ${announcement.id}`);

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

      console.log(`✅ AnnouncementsTab - Enriched announcement: ${announcement.id}`, {
        hasEvent: !!enrichedAnnouncement.eventId,
        tag: enrichedAnnouncement.eventId ? 'event' : 'general',
        associationName: enrichedAnnouncement.detailedAssociation?.name,
        eventTitle: enrichedAnnouncement.detailedEvent?.title,
      });

      return enrichedAnnouncement;
    } catch (error) {
      console.error(`❌ AnnouncementsTab - Failed to enrich announcement ${announcement.id}:`, error);
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
    console.log(`🚀 AnnouncementsTab - Starting enrichment for ${announcementsList.length} announcements`);

    try {
      // Process announcements in parallel for better performance
      const enrichmentPromises = announcementsList.map(announcement => enrichAnnouncement(announcement));

      const enrichedResults = await Promise.allSettled(enrichmentPromises);

      const successfulEnrichments = enrichedResults
        .filter((result): result is PromiseFulfilledResult<IEnhancedAnnouncement> => result.status === 'fulfilled')
        .map(result => result.value);

      console.log(`✅ AnnouncementsTab - Enrichment completed: ${successfulEnrichments.length}/${announcementsList.length} successful`);
      setEnrichedAnnouncements(successfulEnrichments);
    } catch (error) {
      console.error('❌ AnnouncementsTab - Failed to enrich announcements:', error);
      // Fallback to original announcements
      setEnrichedAnnouncements(announcementsList.map(ann => ({ ...ann, isEnriched: false })));
    } finally {
      setEnrichmentLoading(false);
    }
  };

  // Load association data if not already loaded
  useEffect(() => {
    if (!association && associationId) {
      dispatch(getAssociationActionAsync(associationId));
    }
  }, [dispatch, association, associationId]);

  const loadAnnouncements = useCallback(async () => {
    if (!associationId) return;

    try {
      await dispatch(
        getAnnouncementsActionAsync({
          associationId,
          page: 1,
          pageSize: 10,
        }),
      ).unwrap();

      // Handle both array and response object formats
      // const announcementsList = Array.isArray(result) ? result : result.announcements || [];
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  }, [dispatch, associationId]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  // Enrich announcements when they change
  useEffect(() => {
    // Filter announcements for this association first
    const associationAnnouncements = announcements.filter(announcement => announcement.associationId === associationId);

    if (associationAnnouncements && associationAnnouncements.length > 0) {
      enrichAllAnnouncements(associationAnnouncements);
    } else {
      setEnrichedAnnouncements([]);
    }
  }, [announcements, associationId]);

  const handleRefresh = useCallback(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const handleAnnouncementClick = useCallback(
    (announcement: IAnnouncement) => {
      setSelectedAnnouncement(announcement);
      // Fetch comments when announcement is selected
      if (announcement.id) {
        dispatch(getAnnouncementCommentsActionAsync(announcement.id));
      }
    },
    [dispatch],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedAnnouncement(null);
  }, []);

  // Update selectedAnnouncement when enriched announcements list changes (e.g., after like/unlike)
  useEffect(() => {
    if (selectedAnnouncement && enrichedAnnouncements) {
      const updatedAnnouncement = enrichedAnnouncements.find(a => a.id === selectedAnnouncement.id);
      if (updatedAnnouncement && (updatedAnnouncement.likesCount !== selectedAnnouncement.likesCount || updatedAnnouncement.isLiked !== selectedAnnouncement.isLiked)) {
        setSelectedAnnouncement(updatedAnnouncement);
      }
    }
  }, [enrichedAnnouncements, selectedAnnouncement]);

  const handleToggleLike = useCallback(
    async (announcementId: string, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }

      try {
        await dispatch(likeAnnouncementActionAsync(announcementId)).unwrap();

        // Refresh the specific announcement or update in state
        await loadAnnouncements();
      } catch (error) {
        console.error('Failed to toggle like:', error);
      }
    },
    [dispatch, loadAnnouncements],
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

        // Refresh comments for the specific announcement
        dispatch(getAnnouncementCommentsActionAsync(announcementId));

        // Refresh announcements and announcement
        await loadAnnouncements();
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    },
    [dispatch, loadAnnouncements],
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

        // Refresh comments for the selected announcement
        dispatch(getAnnouncementCommentsActionAsync(selectedAnnouncement.id));

        // Refresh announcements and announcement
        await loadAnnouncements();
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    },
    [dispatch, selectedAnnouncement, loadAnnouncements],
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
        // Refresh comments for the selected announcement
        dispatch(getAnnouncementCommentsActionAsync(selectedAnnouncement.id));
        // Refresh announcements
        await loadAnnouncements();
      } catch (error) {
        console.error('Failed to edit comment:', error);
      }
    },
    [dispatch, selectedAnnouncement, loadAnnouncements],
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

  return (
    <>
      <TabsContent value="announcements" className="space-y-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Recent Announcements</h1>
              <p className="text-muted-foreground mt-1 text-sm">Latest announcements from this association</p>
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

          {/* Loading State */}
          {(loading || enrichmentLoading) && enrichedAnnouncements.length === 0 && <AnnouncementsSkeleton />}

          {/* Announcements List */}
          {!loading && !enrichmentLoading && enrichedAnnouncements.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">No announcements found</h3>
              <p className="text-muted-foreground text-sm">This association hasn't posted any announcements yet.</p>
            </div>
          )}

          {/* Enriched Announcements */}
          {enrichedAnnouncements.length > 0 && (
            <div className="space-y-2">
              {(loading || enrichmentLoading) && (
                <div className="text-center py-3">
                  <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Enriching announcement data...
                  </div>
                </div>
              )}
              {enrichedAnnouncements.map(announcement => (
                <div key={announcement.id}>
                  <AnnouncementCard
                    announcement={announcement}
                    onClick={() => handleAnnouncementClick(announcement)}
                    onLike={() => handleToggleLike(announcement.id)}
                    compact={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      {/* Announcement Modal - Rendered using Portal */}
      {selectedAnnouncement &&
        createPortal(
          <AnnouncementModal
            announcement={selectedAnnouncement}
            isOpen={!!selectedAnnouncement}
            onClose={handleCloseModal}
            onLike={() => handleToggleLike(selectedAnnouncement.id)}
            onAddComment={(content, parentId) => handleAddComment(selectedAnnouncement.id, content, parentId)}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />,
          document.body,
        )}
    </>
  );
};

export default AnnouncementsTab;
