/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAnnouncementsActionAsync,
  createAnnouncementActionAsync,
  updateAnnouncementActionAsync,
  deleteAnnouncementActionAsync,
  likeAnnouncementActionAsync,
  createAnnouncementCommentActionAsync,
  updateAnnouncementCommentActionAsync,
  deleteAnnouncementCommentActionAsync,
  getAnnouncementCommentsActionAsync,
} from '@app/store/actions/announcements/announcements-async-actions';
import { getEventsByAssociationActionAsync } from '@app/store/actions/events/events-async-actions';
import { getAnnouncementByIdRequest } from '@app/api/requests/announcement-requests';
import { getAssociationByIdRequest } from '@app/api/requests/association-requests';
import { getEventByIdRequest } from '@app/api/requests/event-requests';
import { CreateAnnouncementModal } from '@app/components/ui/CreateAnnouncementModal';
import { UpdateAnnouncementModal } from '@app/components/ui/UpdateAnnouncementModal';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Search, Plus, RefreshCw, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@app/components/ui/dropdown-menu';
import { IAnnouncement, ICreateAnnouncementRequest, IUpdateAnnouncementRequest } from '@app/types/announcement';
import Swal from 'sweetalert2';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import alertService from '@app/services/alert/alert-service';
import { Card, CardContent } from '@app/components/ui/card';
import { AnnouncementCard } from '@app/components/ui/announcement-card';
import { AnnouncementModal } from '@app/components/ui/announcement-modal';
import { profileCurrentProfileSelector } from '@app/store/selectors/profile-selectors';
import { eventsPageStateSelector } from '@app/store/selectors/events-selectors';
import { announcementsSelector, announcementsLoadingSelector, announcementCommentsSelector, commentsLoadingSelector } from '@app/store/selectors/announcements-selectors';

// Enhanced announcement interface with detailed data
interface IEnhancedAnnouncement extends IAnnouncement {
  detailedAssociation?: any;
  detailedEvent?: any;
  isEnriched?: boolean;
}

export const AssociationAnnouncements: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(profileCurrentProfileSelector);
  const announcements = useAppSelector(announcementsSelector);
  const announcementsLoading = useAppSelector(announcementsLoadingSelector);
  const commentsLoading = useAppSelector(commentsLoadingSelector);
  const eventsState = useAppSelector(eventsPageStateSelector);
  const { events, loading: eventsLoading } = eventsState;
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);
  const [isUpdatingAnnouncement, setIsUpdatingAnnouncement] = useState(false);
  const [announcementToUpdate, setAnnouncementToUpdate] = useState<IAnnouncement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncement | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Enhanced announcements state
  const [enrichedAnnouncements, setEnrichedAnnouncements] = useState<IEnhancedAnnouncement[]>([]);
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);

  // Get association data from profile
  const associationProfile = profile?.associationProfile;

  // Get comments for the selected announcement
  const comments = useAppSelector(state => (selectedAnnouncement ? announcementCommentsSelector(state, selectedAnnouncement.id) : []));

  // Function to enrich a single announcement with detailed data
  const enrichAnnouncement = async (announcement: IAnnouncement): Promise<IEnhancedAnnouncement> => {
    try {
      console.log(`🔍 AssociationAnnouncements - Enriching announcement: ${announcement.id}`);

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

      console.log(`✅ AssociationAnnouncements - Enriched announcement: ${announcement.id}`, {
        hasEvent: !!enrichedAnnouncement.eventId,
        tag: enrichedAnnouncement.eventId ? 'event' : 'general',
        associationName: enrichedAnnouncement.detailedAssociation?.name,
        eventTitle: enrichedAnnouncement.detailedEvent?.title,
      });

      return enrichedAnnouncement;
    } catch (error) {
      console.error(`❌ AssociationAnnouncements - Failed to enrich announcement ${announcement.id}:`, error);
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
    console.log(`🚀 AssociationAnnouncements - Starting enrichment for ${announcementsList.length} announcements`);

    try {
      // Process announcements in parallel for better performance
      const enrichmentPromises = announcementsList.map(announcement => enrichAnnouncement(announcement));

      const enrichedResults = await Promise.allSettled(enrichmentPromises);

      const successfulEnrichments = enrichedResults
        .filter((result): result is PromiseFulfilledResult<IEnhancedAnnouncement> => result.status === 'fulfilled')
        .map(result => result.value);

      console.log(`✅ AssociationAnnouncements - Enrichment completed: ${successfulEnrichments.length}/${announcementsList.length} successful`);
      setEnrichedAnnouncements(successfulEnrichments);
    } catch (error) {
      console.error('❌ AssociationAnnouncements - Failed to enrich announcements:', error);
      // Fallback to original announcements
      setEnrichedAnnouncements(announcementsList.map(ann => ({ ...ann, isEnriched: false })));
    } finally {
      setEnrichmentLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is an association and has profile data
    if (profile?.role !== 'Association' || !associationProfile) {
      navigate('/association/dashboard');
      return;
    }
    loadInitialData();
  }, [profile, associationProfile, navigate]);

  // Enrich announcements when they change
  useEffect(() => {
    if (announcements && announcements.length > 0) {
      enrichAllAnnouncements(announcements);
    } else {
      setEnrichedAnnouncements([]);
    }
  }, [announcements]);

  // Update selectedAnnouncement when enriched announcements list changes (e.g., after like/unlike)
  useEffect(() => {
    if (selectedAnnouncement && enrichedAnnouncements) {
      const updatedAnnouncement = enrichedAnnouncements.find(a => a.id === selectedAnnouncement.id);
      if (updatedAnnouncement && (updatedAnnouncement.likesCount !== selectedAnnouncement.likesCount || updatedAnnouncement.isLiked !== selectedAnnouncement.isLiked)) {
        setSelectedAnnouncement(updatedAnnouncement);
      }
    }
  }, [enrichedAnnouncements, selectedAnnouncement]);

  // Close dropdown when modals open
  useEffect(() => {
    if (isCreatingAnnouncement || isUpdatingAnnouncement || selectedAnnouncement) {
      setOpenDropdownId(null);
    }
  }, [isCreatingAnnouncement, isUpdatingAnnouncement, selectedAnnouncement]);

  const loadInitialData = async () => {
    if (!associationProfile) return;

    // Load both events and announcements
    await Promise.all([loadEvents(), loadAnnouncements()]);
  };

  const loadEvents = async () => {
    if (!associationProfile?.id) {
      console.log('❌ AssociationAnnouncements - No association profile found');
      return;
    }

    try {
      console.log('🔍 AssociationAnnouncements - Loading events for association:', associationProfile.id);
      await dispatch(
        getEventsByAssociationActionAsync({
          associationId: associationProfile.id,
          params: { upcomingOnly: false }, // Get all events, not just upcoming ones
        }),
      ).unwrap();
      console.log('✅ AssociationAnnouncements - Events loaded successfully');
    } catch (error) {
      console.error('❌ AssociationAnnouncements - Failed to load events:', error);
      alertService.errorAlert({
        title: 'Error Loading Events',
        message: 'Failed to load events. Please try again.',
      });
    }
  };

  const loadAnnouncements = async () => {
    if (!associationProfile) return;

    try {
      console.log('🔍 AssociationAnnouncements - Loading announcements for association:', associationProfile.id);
      const result = await dispatch(
        getAnnouncementsActionAsync({
          associationId: associationProfile.id,
          page: 1,
          pageSize: 50, // Load more items since we're filtering on frontend
        }),
      ).unwrap();
      console.log('✅ AssociationAnnouncements - Announcements loaded successfully');
    } catch (error) {
      console.error('❌ AssociationAnnouncements - Error loading announcements:', error);
      alertService.errorAlert({
        title: 'Error',
        message: 'Failed to load announcements',
      });
    }
  };

  const handleRefresh = () => {
    loadInitialData();
  };

  const handleOpenCreateModal = () => {
    console.log('🔍 AssociationAnnouncements - Opening create modal, current events:', events?.length || 0);
    setIsCreatingAnnouncement(true);
  };

  const handleCreateAnnouncement = async (data: { title: string; content: string; type: 'general' | 'event'; eventId?: string; image?: File }) => {
    if (!associationProfile) return;

    setIsLoading(true);
    try {
      const announcementData: ICreateAnnouncementRequest = {
        associationId: associationProfile.id,
        title: data.title,
        content: data.content,
        eventId: data.eventId,
        image: data.image,
      };

      await dispatch(createAnnouncementActionAsync(announcementData)).unwrap();

      // Show success message
      alertService.successAlert('Announcement created successfully');

      // Refresh announcements after creation
      await loadAnnouncements();

      // Close modal after successful creation and refresh
      setIsCreatingAnnouncement(false);
    } catch (error) {
      console.error('Error creating announcement:', error);

      // Show error with more specific message
      const errorMessage = error instanceof Error ? error.message : 'Failed to create announcement. Please try again.';
      alertService.errorAlert({
        title: 'Error Creating Announcement',
        message: errorMessage,
      });

      // Close modal even on error to prevent blocking
      setIsCreatingAnnouncement(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenUpdateModal = (announcement: IAnnouncement) => {
    console.log('🔄 Opening update modal for announcement:', announcement.id);

    // Use setTimeout to defer the modal opening and prevent event conflicts
    setTimeout(() => {
      try {
        setAnnouncementToUpdate(announcement);
        setIsUpdatingAnnouncement(true);
        console.log('✅ Update modal state set successfully');
      } catch (error) {
        console.error('❌ Error opening update modal:', error);
      }
    }, 0);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdatingAnnouncement(false);
    setAnnouncementToUpdate(null);
  };

  const handleUpdateAnnouncement = async (data: { title: string; content: string; type: 'general' | 'event'; eventId?: string; image?: File }) => {
    if (!announcementToUpdate) return;

    setIsLoading(true);
    try {
      const updateData: IUpdateAnnouncementRequest = {
        title: data.title,
        content: data.content,
        image: data.image,
      };

      await dispatch(
        updateAnnouncementActionAsync({
          announcementId: announcementToUpdate.id,
          announcementData: updateData,
        }),
      ).unwrap();

      // Show success message
      alertService.successAlert('Announcement updated successfully');

      // Refresh announcements after update
      await loadAnnouncements();

      // Close modal after successful update and refresh
      setIsUpdatingAnnouncement(false);
      setAnnouncementToUpdate(null);
    } catch (error) {
      console.error('Error updating announcement:', error);

      // Show error with more specific message
      const errorMessage = error instanceof Error ? error.message : 'Failed to update announcement. Please try again.';
      alertService.errorAlert({
        title: 'Error Updating Announcement',
        message: errorMessage,
      });

      // Close modal even on error to prevent blocking
      setIsUpdatingAnnouncement(false);
      setAnnouncementToUpdate(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        customClass: {
          container: 'swal-z-index-high',
        },
      });

      if (!result.isConfirmed) return;

      await dispatch(deleteAnnouncementActionAsync(announcementId)).unwrap();

      // Show success message
      alertService.successAlert('Announcement deleted successfully');

      // Refresh announcements after deletion
      await loadAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alertService.errorAlert({
        title: 'Error Deleting Announcement',
        message: 'Failed to delete announcement. Please try again.',
      });
    }
  };

  const handleAnnouncementClick = (announcement: IAnnouncement) => {
    setSelectedAnnouncement(announcement);
    // Fetch comments when announcement is selected
    if (announcement.id) {
      dispatch(getAnnouncementCommentsActionAsync(announcement.id));
    }
  };

  const handleToggleLike = async (announcementId: string) => {
    try {
      await dispatch(likeAnnouncementActionAsync(announcementId)).unwrap();

      // Refresh announcements to get updated like count
      await loadAnnouncements();
    } catch (error) {
      console.error('Error toggling like:', error);
      alertService.errorAlert({
        title: 'Error',
        message: 'Failed to update like status',
      });
    }
  };

  const handleAddComment = async (announcementId: string, content: string, parentId?: string) => {
    try {
      await dispatch(
        createAnnouncementCommentActionAsync({
          announcementId,
          commentData: { content, parentId },
        }),
      ).unwrap();

      // Refresh comments for the specific announcement
      dispatch(getAnnouncementCommentsActionAsync(announcementId));

      // Refresh announcements to get updated comment count
      await loadAnnouncements();
    } catch (error) {
      console.error('Error adding comment:', error);
      alertService.errorAlert({
        title: 'Error',
        message: 'Failed to add comment',
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
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

      // Refresh announcements to get updated comment count
      await loadAnnouncements();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alertService.errorAlert({
        title: 'Error',
        message: 'Failed to delete comment',
      });
    }
  };

  const handleCloseModal = () => {
    setSelectedAnnouncement(null);
  };

  const handleEditComment = async (commentId: string, content: string) => {
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

      // Refresh announcements to get updated comment count
      await loadAnnouncements();
    } catch (error) {
      console.error('Error editing comment:', error);
      alertService.errorAlert({
        title: 'Error',
        message: 'Failed to edit comment',
      });
    }
  };

  // Filter enriched announcements based on search
  const filteredAnnouncements = React.useMemo(() => {
    if (!enrichedAnnouncements || enrichedAnnouncements.length === 0) {
      return [];
    }

    let filtered = enrichedAnnouncements;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        announcement =>
          announcement.title.toLowerCase().includes(searchLower) ||
          announcement.content.toLowerCase().includes(searchLower) ||
          (announcement as any).associationName?.toLowerCase().includes(searchLower) ||
          announcement.association?.name?.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  }, [enrichedAnnouncements, searchTerm]);

  // Show loading state while profile is loading
  if (!profile) {
    return (
      <div className="container mx-auto px-3 md:px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Redirect if not an association or no profile
  if (profile.role !== 'Association' || !associationProfile) {
    return null;
  }

  const isLoadingData = announcementsLoading || enrichmentLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 md:px-4 py-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Announcements</h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage announcements for {associationProfile.name}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoadingData || eventsLoading}
              className="h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
            >
              <RefreshCw className={`w-3 h-3 mr-1.5 ${isLoadingData || eventsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleOpenCreateModal}
              className="h-8 text-xs bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-3 h-3 mr-1.5" />
              Create Announcement
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
          <Input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
        </div>

        {/* Loading State */}
        {isLoadingData && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Announcements List */}
        {!isLoadingData && (
          <div className="space-y-3">
            {filteredAnnouncements.length === 0 ? (
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-8 text-center">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{searchTerm ? 'No announcements found' : 'No announcements yet'}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{searchTerm ? 'Try adjusting your search terms' : 'Create your first announcement to get started'}</p>
                  {!searchTerm && (
                    <Button
                      onClick={handleOpenCreateModal}
                      className="h-8 text-xs bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Plus className="w-3 h-3 mr-1.5" />
                      Create Announcement
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredAnnouncements.map((announcement: IEnhancedAnnouncement, index) => (
                  <div
                    key={announcement.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-4 relative"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both',
                    }}
                  >
                    <AnnouncementCard
                      announcement={announcement}
                      onClick={() => handleAnnouncementClick(announcement)}
                      onLike={() => handleToggleLike(announcement.id)}
                      compact={true}
                    />

                    {/* Edit/Delete Dropdown - Positioned in footer */}
                    <div className="absolute bottom-4 right-4 z-10">
                      <DropdownMenu
                        open={openDropdownId === announcement.id}
                        onOpenChange={open => {
                          console.log('🔄 Dropdown state change:', { announcementId: announcement.id, open });
                          setOpenDropdownId(open ? announcement.id : null);
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('🖱️ Dropdown trigger clicked for announcement:', announcement.id);
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 z-[10000]" onClick={e => e.stopPropagation()} onCloseAutoFocus={e => e.preventDefault()}>
                          <DropdownMenuItem
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('🖱️ Edit button clicked for announcement:', announcement.id);
                              setOpenDropdownId(null); // Close dropdown first
                              handleOpenUpdateModal(announcement);
                            }}
                            className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                            onSelect={e => e.preventDefault()}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('🗑️ Delete button clicked for announcement:', announcement.id);
                              setOpenDropdownId(null); // Close dropdown first
                              handleDeleteAnnouncement(announcement.id);
                            }}
                            className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                            onSelect={e => e.preventDefault()}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Announcement Modal */}
        <CreateAnnouncementModal
          isOpen={isCreatingAnnouncement}
          onClose={() => setIsCreatingAnnouncement(false)}
          onSubmit={handleCreateAnnouncement}
          events={events || []}
          isLoading={isLoading}
        />

        {/* Update Announcement Modal */}
        <UpdateAnnouncementModal
          isOpen={isUpdatingAnnouncement}
          onClose={handleCloseUpdateModal}
          onSubmit={handleUpdateAnnouncement}
          announcement={announcementToUpdate}
          events={events || []}
          isLoading={isLoading}
        />

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
